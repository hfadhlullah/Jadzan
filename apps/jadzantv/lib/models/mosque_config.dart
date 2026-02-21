import 'prayer_entry.dart';

/// Mosque configuration loaded from Supabase.
/// Mirrors MosqueConfig interface from the React Native version.
class MosqueConfig {
  final double latitude;
  final double longitude;
  final String calculationMethod;
  final IqomahDelays iqomahDelays;
  final String name;
  final String? address;
  final String? backgroundUrl;
  final double? arabesqueOpacity;
  final int hijriAdjustment;

  const MosqueConfig({
    required this.latitude,
    required this.longitude,
    required this.calculationMethod,
    required this.iqomahDelays,
    required this.name,
    this.address,
    this.backgroundUrl,
    this.arabesqueOpacity,
    this.hijriAdjustment = 0,
  });

  factory MosqueConfig.fromJson(Map<String, dynamic> json) {
    return MosqueConfig(
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      calculationMethod: json['calculation_method'] as String? ?? 'KEMENAG',
      iqomahDelays: json['iqomah_delays'] != null
          ? IqomahDelays.fromJson(
              Map<String, dynamic>.from(json['iqomah_delays'] as Map))
          : const IqomahDelays(),
      name: json['name'] as String? ?? '',
      address: json['address'] as String?,
      backgroundUrl: json['background_url'] as String?,
      arabesqueOpacity: (json['arabesque_opacity'] as num?)?.toDouble(),
      hijriAdjustment: (json['hijri_adjustment'] as num?)?.toInt() ?? 0,
    );
  }
}
