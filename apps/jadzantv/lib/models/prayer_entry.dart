/// Prayer-related data models and enums.
/// Mirrors services/prayerService.ts from the React Native version.

enum PrayerName {
  imsak,
  fajr,
  sunrise,
  dhuhr,
  asr,
  maghrib,
  isha,
}

enum DisplayState {
  idle,
  approaching,
  adzan,
  iqomah,
  prayer,
}

class PrayerEntry {
  final PrayerName name;
  final String label;
  final String labelAr;
  final DateTime time;

  const PrayerEntry({
    required this.name,
    required this.label,
    required this.labelAr,
    required this.time,
  });

  PrayerEntry copyWith({DateTime? time}) {
    return PrayerEntry(
      name: name,
      label: label,
      labelAr: labelAr,
      time: time ?? this.time,
    );
  }
}

class IqomahDelays {
  final int fajr;
  final int dhuhr;
  final int asr;
  final int maghrib;
  final int isha;

  const IqomahDelays({
    this.fajr = 10,
    this.dhuhr = 10,
    this.asr = 10,
    this.maghrib = 5,
    this.isha = 10,
  });

  factory IqomahDelays.fromJson(Map<String, dynamic> json) {
    return IqomahDelays(
      fajr: (json['fajr'] as num?)?.toInt() ?? 10,
      dhuhr: (json['dhuhr'] as num?)?.toInt() ?? 10,
      asr: (json['asr'] as num?)?.toInt() ?? 10,
      maghrib: (json['maghrib'] as num?)?.toInt() ?? 5,
      isha: (json['isha'] as num?)?.toInt() ?? 10,
    );
  }

  int getDelay(PrayerName name) {
    switch (name) {
      case PrayerName.fajr:
        return fajr;
      case PrayerName.dhuhr:
        return dhuhr;
      case PrayerName.asr:
        return asr;
      case PrayerName.maghrib:
        return maghrib;
      case PrayerName.isha:
        return isha;
      default:
        return 10;
    }
  }
}

class PrayerEngineState {
  final DisplayState displayState;
  final PrayerName? currentPrayer;
  final PrayerName? nextPrayer;
  final int countdown; // seconds remaining in current phase
  final List<PrayerEntry> prayers;
  final DateTime now;

  const PrayerEngineState({
    this.displayState = DisplayState.idle,
    this.currentPrayer,
    this.nextPrayer,
    this.countdown = 0,
    this.prayers = const [],
    required this.now,
  });
}

/// Metadata for each prayer name
const Map<PrayerName, ({String label, String labelAr})> prayerMeta = {
  PrayerName.imsak: (label: 'Imsak', labelAr: 'إمساك'),
  PrayerName.fajr: (label: 'Subuh', labelAr: 'الفجر'),
  PrayerName.sunrise: (label: 'Syuruq', labelAr: 'الشروق'),
  PrayerName.dhuhr: (label: 'Dzuhur', labelAr: 'الظهر'),
  PrayerName.asr: (label: 'Ashar', labelAr: 'العصر'),
  PrayerName.maghrib: (label: 'Maghrib', labelAr: 'المغرب'),
  PrayerName.isha: (label: 'Isya', labelAr: 'العشاء'),
};

const List<PrayerName> prayerOrder = PrayerName.values;
