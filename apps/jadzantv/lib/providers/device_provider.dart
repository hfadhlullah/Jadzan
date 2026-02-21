import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Device state provider.
/// Mirrors store/deviceStore.ts from the React Native version.

class DeviceProvider extends ChangeNotifier {
  static const String _screenIdKey = '@jadzan/screen_id';

  String? _screenId;
  String? _mosqueId;
  bool _isConfigured = false;
  bool _isLoading = true;

  String? get screenId => _screenId;
  String? get mosqueId => _mosqueId;
  bool get isConfigured => _isConfigured;
  bool get isLoading => _isLoading;

  Future<void> loadFromStorage() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _screenId = prefs.getString(_screenIdKey);
      _isConfigured = _screenId != null;
      _isLoading = false;
      notifyListeners();
    } catch (err) {
      debugPrint('[deviceProvider] Failed to load from storage: $err');
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> setScreenId(String id) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_screenIdKey, id);
      _screenId = id;
      _isConfigured = true;
      notifyListeners();
    } catch (err) {
      debugPrint('[deviceProvider] Failed to persist screenId: $err');
    }
  }

  void setMosqueId(String id) {
    _mosqueId = id;
    notifyListeners();
  }

  Future<void> clearDevice() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_screenIdKey);
      _screenId = null;
      _mosqueId = null;
      _isConfigured = false;
      notifyListeners();
    } catch (err) {
      debugPrint('[deviceProvider] Failed to clear device: $err');
    }
  }
}
