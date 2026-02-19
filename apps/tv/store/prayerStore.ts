import { create } from 'zustand';
import type { PrayerEngineState } from '../services/prayerService';
import { PrayerEngine } from '../services/prayerService';
import type { IqomahDelays } from '../services/prayerService';

interface PrayerStore extends PrayerEngineState {
  engine: PrayerEngine | null;
  startEngine: (config: {
    lat: number;
    lng: number;
    method: string;
    iqomahDelays: IqomahDelays;
  }) => void;
  stopEngine: () => void;
}

export const usePrayerStore = create<PrayerStore>((set, get) => ({
  // Default / loading state
  displayState: 'IDLE',
  currentPrayer: null,
  nextPrayer: null,
  countdown: 0,
  prayers: [],
  now: new Date(),
  engine: null,

  startEngine({ lat, lng, method, iqomahDelays }) {
    // Stop any existing engine first
    get().engine?.stop();

    const engine = new PrayerEngine({
      lat,
      lng,
      method,
      iqomahDelays,
      onStateChange: (state) => set(state),
    });
    engine.start();
    set({ engine });
  },

  stopEngine() {
    get().engine?.stop();
    set({ engine: null });
  },
}));
