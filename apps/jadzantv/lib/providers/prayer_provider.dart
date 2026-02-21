import 'package:flutter/foundation.dart';
import '../models/prayer_entry.dart';
import '../services/prayer_service.dart';

/// Prayer engine state provider.
/// Mirrors store/prayerStore.ts from the React Native version.

class PrayerProvider extends ChangeNotifier {
  PrayerEngine? _engine;

  // Default / loading state
  DisplayState _displayState = DisplayState.idle;
  PrayerName? _currentPrayer;
  PrayerName? _nextPrayer;
  int _countdown = 0;
  List<PrayerEntry> _prayers = [];
  DateTime _now = DateTime.now();

  DisplayState get displayState => _displayState;
  PrayerName? get currentPrayer => _currentPrayer;
  PrayerName? get nextPrayer => _nextPrayer;
  int get countdown => _countdown;
  List<PrayerEntry> get prayers => _prayers;
  DateTime get now => _now;

  void startEngine({
    required double lat,
    required double lng,
    required String method,
    required IqomahDelays iqomahDelays,
  }) {
    // Stop any existing engine first
    _engine?.stop();

    _engine = PrayerEngine(
      lat: lat,
      lng: lng,
      method: method,
      iqomahDelays: iqomahDelays,
      onStateChange: (state) {
        _displayState = state.displayState;
        _currentPrayer = state.currentPrayer;
        _nextPrayer = state.nextPrayer;
        _countdown = state.countdown;
        _prayers = state.prayers;
        _now = state.now;
        notifyListeners();
      },
    );
    _engine!.start();
  }

  void stopEngine() {
    _engine?.stop();
    _engine = null;
  }

  @override
  void dispose() {
    _engine?.stop();
    super.dispose();
  }
}
