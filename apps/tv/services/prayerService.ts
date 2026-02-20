/**
 * JADZ-016: Prayer Service
 * Wraps adhan-js to calculate daily prayer times and expose a
 * tick-driven state machine consumed by the TV display.
 *
 * States:
 *   IDLE        → Normal display
 *   APPROACHING → 5 min warning before prayer (gentle highlight)
 *   ADZAN       → Prayer time reached (5-min adzan phase)
 *   IQOMAH      → Countdown (iqomah_delay min after adzan ends)
 *   PRAYER      → During prayer (15 min after iqomah)
 */

import {
  PrayerTimes,
  Coordinates,
  CalculationMethod,
  CalculationParameters,
} from 'adhan';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type PrayerName = 'imsak' | 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
export type DisplayState = 'IDLE' | 'APPROACHING' | 'ADZAN' | 'IQOMAH' | 'PRAYER';

export interface PrayerEntry {
  name: PrayerName;
  label: string;
  labelAr: string;
  time: Date;
}

export interface IqomahDelays {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface PrayerEngineState {
  displayState: DisplayState;
  currentPrayer: PrayerName | null;   // active during ADZAN/IQOMAH/PRAYER
  nextPrayer: PrayerName | null;      // next upcoming prayer
  countdown: number;                  // seconds remaining in current phase
  prayers: PrayerEntry[];             // today's 5 prayer times (+ tomorrow Fajr)
  now: Date;
}

const PRAYER_META: Record<PrayerName, { label: string; labelAr: string }> = {
  imsak:   { label: 'Imsak',   labelAr: 'إمساك'   },
  fajr:    { label: 'Subuh',   labelAr: 'الفجر'   },
  sunrise: { label: 'Syuruq',  labelAr: 'الشروق'  },
  dhuhr:   { label: 'Dzuhur',  labelAr: 'الظهر'   },
  asr:     { label: 'Ashar',   labelAr: 'العصر'   },
  maghrib: { label: 'Maghrib', labelAr: 'المغرب'  },
  isha:    { label: 'Isya',    labelAr: 'العشاء'  },
};

const PRAYER_ORDER: PrayerName[] = ['imsak', 'fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

// How long the adzan phase lasts (ms) before IQOMAH starts
const ADZAN_DURATION_MS = 5 * 1000;
// How long the prayer phase lasts (ms) after iqomah ends
const PRAYER_DURATION_MS = 5 * 1000;
// How many seconds before prayer to show APPROACHING warning
const APPROACHING_THRESHOLD_S = 5 * 60;

// ─────────────────────────────────────────────────────────────
// Calculation Method Mapping
// ─────────────────────────────────────────────────────────────

function getParams(method: string): CalculationParameters {
  switch (method) {
    case 'MWL':   return CalculationMethod.MuslimWorldLeague();
    case 'ISNA':  return CalculationMethod.NorthAmerica();
    case 'EGYPT': return CalculationMethod.Egyptian();
    case 'KEMENAG':
    default:
      // Indonesian KEMENAG is close to Singapore method
      return CalculationMethod.Singapore();
  }
}

// ─────────────────────────────────────────────────────────────
// Calculate prayer times for a given date
// ─────────────────────────────────────────────────────────────

export function getPrayerEntries(
  lat: number,
  lng: number,
  method: string,
  date: Date
): PrayerEntry[] {
  const coords = new Coordinates(lat, lng);
  const params = getParams(method);
  const pt = new PrayerTimes(coords, date, params);

  return PRAYER_ORDER.map((name) => {
    let time: Date;
    if (name === 'imsak') {
      // Imsak is 10 minutes before Fajr
      time = new Date(pt.fajr.getTime() - 10 * 60 * 1000);
    } else {
      time = pt[name] as Date;
    }

    return {
      name,
      label:   PRAYER_META[name].label,
      labelAr: PRAYER_META[name].labelAr,
      time,
    };
  });
}

// ─────────────────────────────────────────────────────────────
// PrayerEngine class
// ─────────────────────────────────────────────────────────────

interface EngineConfig {
  lat: number;
  lng: number;
  method: string;
  iqomahDelays: IqomahDelays;
  onStateChange: (state: PrayerEngineState) => void;
}

type PhaseInfo = {
  prayer: PrayerName;
  phase: 'ADZAN' | 'IQOMAH' | 'PRAYER';
  phaseEnd: Date;
};

export class PrayerEngine {
  private config: EngineConfig;
  private todayPrayers: PrayerEntry[] = [];
  private tomorrowFajr: Date | null = null;
  private activePhase: PhaseInfo | null = null;
  private tickTimer: ReturnType<typeof setInterval> | null = null;
  private lastDate = '';

  constructor(config: EngineConfig) {
    this.config = config;
  }

  start() {
    this.recalculate();
    this.tickTimer = setInterval(() => this.tick(), 1000);
    this.tick(); // emit immediately
  }

  stop() {
    if (this.tickTimer) clearInterval(this.tickTimer);
  }

  private recalculate() {
    const now = new Date();
    const { lat, lng, method } = this.config;
    this.todayPrayers = getPrayerEntries(lat, lng, method, now);
    // force fajr to be 10 seconds from now (for testing)
    if (this.todayPrayers.length > 1) {
      this.todayPrayers[1].time = new Date(now.getTime() + 10 * 1000);
    }
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowEntries = getPrayerEntries(lat, lng, method, tomorrow);
    this.tomorrowFajr = tomorrowEntries.find((p) => p.name === 'fajr')?.time ?? null;
  }

  private tick() {
    const now = new Date();

    // Recalculate at midnight rollover
    const dateKey = now.toDateString();
    if (dateKey !== this.lastDate) {
      this.lastDate = dateKey;
      this.recalculate();
    }

    const state = this.computeState(now);
    this.config.onStateChange(state);
  }

  private computeState(now: Date): PrayerEngineState {
    const { iqomahDelays } = this.config;

    // If we're inside an active phase (ADZAN → IQOMAH → PRAYER), stay there
    if (this.activePhase) {
      const remaining = this.activePhase.phaseEnd.getTime() - now.getTime();
      if (remaining > 0) {
        return this.buildState(now, this.activePhase.phase, this.activePhase.prayer, Math.ceil(remaining / 1000));
      }
      // Transition to next phase
      this.activePhase = this.nextPhase(this.activePhase, iqomahDelays);
      if (this.activePhase) {
        const rem = this.activePhase.phaseEnd.getTime() - now.getTime();
        return this.buildState(now, this.activePhase.phase, this.activePhase.prayer, Math.ceil(rem / 1000));
      }
    }

    // Check if any prayer just started (within last 5 min = adzan window)
    const ADZAN_PRAYERS: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    for (const prayer of [...this.todayPrayers].reverse()) {
      if (!ADZAN_PRAYERS.includes(prayer.name)) continue;

      const diff = now.getTime() - prayer.time.getTime();
      if (diff >= 0 && diff < ADZAN_DURATION_MS) {
        const phaseEnd = new Date(prayer.time.getTime() + ADZAN_DURATION_MS);
        this.activePhase = { prayer: prayer.name, phase: 'ADZAN', phaseEnd };
        return this.buildState(now, 'ADZAN', prayer.name, Math.ceil((phaseEnd.getTime() - now.getTime()) / 1000));
      }
    }

    // Calculate next prayer
    const allPrayers = this.getOrderedPrayers();
    const next = allPrayers.find((p) => p.time > now) ?? null;

    if (next) {
      const secsUntil = Math.ceil((next.time.getTime() - now.getTime()) / 1000);
      const displayState: DisplayState = secsUntil <= APPROACHING_THRESHOLD_S ? 'APPROACHING' : 'IDLE';
      return this.buildState(now, displayState, null, secsUntil);
    }

    return this.buildState(now, 'IDLE', null, 0);
  }

  private nextPhase(current: PhaseInfo, delays: IqomahDelays): PhaseInfo | null {
    if (current.phase === 'ADZAN') {
      // FORCE 5 seconds for testing
      const delayMs = 5 * 1000; 
      // const delayMs = delays[current.prayer];
      return {
        prayer: current.prayer,
        phase: 'IQOMAH',
        phaseEnd: new Date(current.phaseEnd.getTime() + delayMs),
      };
    }
    if (current.phase === 'IQOMAH') {
      return {
        prayer: current.prayer,
        phase: 'PRAYER',
        phaseEnd: new Date(current.phaseEnd.getTime() + PRAYER_DURATION_MS),
      };
    }
    return null; // PRAYER → IDLE
  }

  private buildState(
    now: Date,
    displayState: DisplayState,
    activePrayer: PrayerName | null,
    countdown: number
  ): PrayerEngineState {
    const allPrayers = this.getOrderedPrayers();
    const nextPrayer = allPrayers.find((p) => p.time > now)?.name ?? null;

    return {
      displayState,
      currentPrayer: activePrayer,
      nextPrayer,
      countdown,
      prayers: this.todayPrayers,
      now,
    };
  }

  private getOrderedPrayers(): PrayerEntry[] {
    const list = [...this.todayPrayers];
    if (this.tomorrowFajr) {
      const tomorrowFajrEntry = list.find((p) => p.name === 'fajr');
      if (tomorrowFajrEntry) {
        list.push({ ...tomorrowFajrEntry, time: this.tomorrowFajr });
      }
    }
    return list.sort((a, b) => a.time.getTime() - b.time.getTime());
  }
}
