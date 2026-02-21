import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

/// Local storage service using SharedPreferences.
/// Mirrors services/storageService.ts from the React Native version.

class StorageService {
  StorageService._();

  static const String _screenIdKey = '@jadzan/screen_id';
  static const String _mosqueIdKey = '@jadzan/mosque_id';
  static const String _mosqueConfigCacheKey = '@jadzan/mosque_config_cache';

  static Future<String?> getScreenId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_screenIdKey);
  }

  static Future<void> setScreenId(String id) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_screenIdKey, id);
  }

  static Future<String?> getMosqueId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_mosqueIdKey);
  }

  static Future<void> setMosqueId(String id) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_mosqueIdKey, id);
  }

  /// Cache the raw mosque config JSON from Supabase.
  static Future<void> saveMosqueConfig(Map<String, dynamic> json) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_mosqueConfigCacheKey, jsonEncode(json));
  }

  /// Load the last successfully cached mosque config, or null if none.
  static Future<Map<String, dynamic>?> loadMosqueConfig() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_mosqueConfigCacheKey);
    if (raw == null) return null;
    try {
      return Map<String, dynamic>.from(jsonDecode(raw) as Map);
    } catch (_) {
      return null;
    }
  }

  static Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_screenIdKey);
    await prefs.remove(_mosqueIdKey);
    await prefs.remove(_mosqueConfigCacheKey);
  }
}
