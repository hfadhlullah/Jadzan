import 'dart:async';
import 'package:adhan_dart/adhan_dart.dart';
import '../models/prayer_entry.dart';

/// Prayer Service — wraps adhan_dart to calculate daily prayer times
/// and expose a tick-driven state machine consumed by the TV display.
///
/// States:
///   IDLE        → Normal display
///   APPROACHING → 5 min warning before prayer (gentle highlight)
///   ADZAN       → Prayer time reached (5-min adzan phase)
///   IQOMAH      → Countdown (iqomah_delay minutes from Supabase config)
///   PRAYER      → During prayer (15 min after iqomah)
///
/// Mirrors services/prayerService.ts from the React Native version exactly.

// How long the adzan phase lasts (ms) before IQOMAH starts — 5 minutes
const int _adzanDurationMs = 5 * 60 * 1000;
// How long the prayer phase lasts (ms) after iqomah ends — 15 minutes
const int _prayerDurationMs = 15 * 60 * 1000;
// How many seconds before prayer to show APPROACHING warning — 5 minutes
const int _approachingThresholdS = 5 * 60;

// ─────────────────────────────────────────────────────────────
// Calculation Method Mapping
// ─────────────────────────────────────────────────────────────

CalculationParameters _getParams(String method) {
  switch (method) {
    case 'MWL':
      return CalculationMethodParameters.muslimWorldLeague();
    case 'ISNA':
      return CalculationMethodParameters.northAmerica();
    case 'EGYPT':
      return CalculationMethodParameters.egyptian();
    case 'KEMENAG':
    default:
      // Indonesian KEMENAG is close to Singapore method
      return CalculationMethodParameters.singapore();
  }
}

// ─────────────────────────────────────────────────────────────
// Calculate prayer times for a given date
// ─────────────────────────────────────────────────────────────

List<PrayerEntry> getPrayerEntries(
    double lat, double lng, String method, DateTime date) {
  final coords = Coordinates(lat, lng);
  final params = _getParams(method);
  final pt = PrayerTimes(
    date: date,
    coordinates: coords,
    calculationParameters: params,
  );

  // adhan_dart returns DateTime.utc(...) — convert to local for display.
  DateTime toLocal(DateTime utc) => utc.toLocal();

  return prayerOrder.map((name) {
    DateTime time;
    switch (name) {
      case PrayerName.imsak:
        // Imsak is 10 minutes before Fajr
        time = toLocal(pt.fajr).subtract(const Duration(minutes: 10));
        break;
      case PrayerName.fajr:
        time = toLocal(pt.fajr);
        break;
      case PrayerName.sunrise:
        time = toLocal(pt.sunrise);
        break;
      case PrayerName.dhuhr:
        time = toLocal(pt.dhuhr);
        break;
      case PrayerName.asr:
        time = toLocal(pt.asr);
        break;
      case PrayerName.maghrib:
        time = toLocal(pt.maghrib);
        break;
      case PrayerName.isha:
        time = toLocal(pt.isha);
        break;
    }

    final meta = prayerMeta[name]!;
    return PrayerEntry(
      name: name,
      label: meta.label,
      labelAr: meta.labelAr,
      time: time,
    );
  }).toList();
}

// ─────────────────────────────────────────────────────────────
// PhaseInfo — tracks active prayer phase
// ─────────────────────────────────────────────────────────────

class _PhaseInfo {
  final PrayerName prayer;
  final DisplayState phase;
  final DateTime phaseEnd;

  _PhaseInfo({
    required this.prayer,
    required this.phase,
    required this.phaseEnd,
  });
}

// ─────────────────────────────────────────────────────────────
// PrayerEngine class
// ─────────────────────────────────────────────────────────────

class PrayerEngine {
  final double lat;
  final double lng;
  final String method;
  final IqomahDelays iqomahDelays;
  final void Function(PrayerEngineState state) onStateChange;

  List<PrayerEntry> _todayPrayers = [];
  DateTime? _tomorrowFajr;
  _PhaseInfo? _activePhase;
  Timer? _tickTimer;
  String _lastDate = '';

  PrayerEngine({
    required this.lat,
    required this.lng,
    required this.method,
    required this.iqomahDelays,
    required this.onStateChange,
  });

  void start() {
    _recalculate();
    _tickTimer = Timer.periodic(const Duration(seconds: 1), (_) => _tick());
    _tick(); // emit immediately
  }

  void stop() {
    _tickTimer?.cancel();
    _tickTimer = null;
  }

  void _recalculate() {
    final now = DateTime.now();
    _todayPrayers = getPrayerEntries(lat, lng, method, now);
    final tomorrow = now.add(const Duration(days: 1));
    final tomorrowEntries = getPrayerEntries(lat, lng, method, tomorrow);
    _tomorrowFajr = tomorrowEntries
        .where((p) => p.name == PrayerName.fajr)
        .map((p) => p.time)
        .firstOrNull;
  }

  void _tick() {
    final now = DateTime.now();

    // Recalculate at midnight rollover
    final dateKey = '${now.year}-${now.month}-${now.day}';
    if (dateKey != _lastDate) {
      _lastDate = dateKey;
      _recalculate();
    }

    final state = _computeState(now);
    onStateChange(state);
  }

  PrayerEngineState _computeState(DateTime now) {
    // If we're inside an active phase (ADZAN → IQOMAH → PRAYER), stay there
    if (_activePhase != null) {
      final remaining =
          _activePhase!.phaseEnd.millisecondsSinceEpoch - now.millisecondsSinceEpoch;
      if (remaining > 0) {
        return _buildState(
          now,
          _activePhase!.phase,
          _activePhase!.prayer,
          (remaining / 1000).ceil(),
        );
      }
      // Transition to next phase
      _activePhase = _nextPhase(_activePhase!, iqomahDelays);
      if (_activePhase != null) {
        final rem =
            _activePhase!.phaseEnd.millisecondsSinceEpoch - now.millisecondsSinceEpoch;
        return _buildState(
          now,
          _activePhase!.phase,
          _activePhase!.prayer,
          (rem / 1000).ceil(),
        );
      }
    }

    // Check if any prayer just started (within adzan window)
    const adzanPrayers = [
      PrayerName.fajr,
      PrayerName.dhuhr,
      PrayerName.asr,
      PrayerName.maghrib,
      PrayerName.isha,
    ];
    for (final prayer in _todayPrayers.reversed) {
      if (!adzanPrayers.contains(prayer.name)) continue;

      final diff = now.millisecondsSinceEpoch - prayer.time.millisecondsSinceEpoch;
      if (diff >= 0 && diff < _adzanDurationMs) {
        final phaseEnd = prayer.time.add(const Duration(milliseconds: _adzanDurationMs));
        _activePhase = _PhaseInfo(
          prayer: prayer.name,
          phase: DisplayState.adzan,
          phaseEnd: phaseEnd,
        );
        return _buildState(
          now,
          DisplayState.adzan,
          prayer.name,
          ((phaseEnd.millisecondsSinceEpoch - now.millisecondsSinceEpoch) / 1000).ceil(),
        );
      }
    }

    // Calculate next prayer
    final allPrayers = _getOrderedPrayers();
    final next = allPrayers.where((p) => p.time.isAfter(now)).firstOrNull;

    if (next != null) {
      final secsUntil =
          ((next.time.millisecondsSinceEpoch - now.millisecondsSinceEpoch) / 1000).ceil();
      final displayState =
          secsUntil <= _approachingThresholdS ? DisplayState.approaching : DisplayState.idle;
      return _buildState(now, displayState, null, secsUntil);
    }

    return _buildState(now, DisplayState.idle, null, 0);
  }

  _PhaseInfo? _nextPhase(_PhaseInfo current, IqomahDelays delays) {
    if (current.phase == DisplayState.adzan) {
      // Use per-prayer iqomah delay from Supabase config (in minutes → ms)
      final delayMs = delays.getDelay(current.prayer) * 60 * 1000;
      return _PhaseInfo(
        prayer: current.prayer,
        phase: DisplayState.iqomah,
        phaseEnd:
            current.phaseEnd.add(Duration(milliseconds: delayMs)),
      );
    }
    if (current.phase == DisplayState.iqomah) {
      return _PhaseInfo(
        prayer: current.prayer,
        phase: DisplayState.prayer,
        phaseEnd:
            current.phaseEnd.add(const Duration(milliseconds: _prayerDurationMs)),
      );
    }
    return null; // PRAYER → IDLE
  }

  PrayerEngineState _buildState(
    DateTime now,
    DisplayState displayState,
    PrayerName? activePrayer,
    int countdown,
  ) {
    final allPrayers = _getOrderedPrayers();
    final nextPrayer = allPrayers
        .where((p) => p.time.isAfter(now))
        .map((p) => p.name)
        .firstOrNull;

    return PrayerEngineState(
      displayState: displayState,
      currentPrayer: activePrayer,
      nextPrayer: nextPrayer,
      countdown: countdown,
      prayers: _todayPrayers,
      now: now,
    );
  }

  List<PrayerEntry> _getOrderedPrayers() {
    final list = [..._todayPrayers];
    if (_tomorrowFajr != null) {
      final fajrEntry = list.where((p) => p.name == PrayerName.fajr).firstOrNull;
      if (fajrEntry != null) {
        list.add(fajrEntry.copyWith(time: _tomorrowFajr!));
      }
    }
    list.sort((a, b) => a.time.compareTo(b.time));
    return list;
  }
}
