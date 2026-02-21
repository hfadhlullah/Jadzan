import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../constants/app_theme.dart';
import '../models/prayer_entry.dart';
import '../providers/prayer_provider.dart';

String _pad(int n) => n.toString().padLeft(2, '0');
String _formatTime(DateTime date) => '${_pad(date.hour)}:${_pad(date.minute)}';

String _formatHijri(DateTime date) {
  // Use Hijri date from intl — approximate with Umm al-Qura
  // In real locale it would need platform locale support; use fallback
  try {
    // Dart doesn't have built-in Islamic calendar; return empty and let screen handle
    return '';
  } catch (_) {
    return '';
  }
}

/// Legacy sidebar for the display screen (25% width).
/// Mirrors components/PrayerSidebar.tsx from the React Native version.
class PrayerSidebar extends StatelessWidget {
  const PrayerSidebar({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<PrayerProvider>(
      builder: (context, prayer, _) {
        final activePrayerName =
            (prayer.displayState == DisplayState.adzan ||
                    prayer.displayState == DisplayState.iqomah ||
                    prayer.displayState == DisplayState.prayer)
                ? prayer.currentPrayer
                : null;

        return Container(
          width: MediaQuery.of(context).size.width * 0.25,
          decoration: const BoxDecoration(
            color: AppColors.surface,
            border: Border(
              right: BorderSide(color: AppColors.border, width: 1),
            ),
          ),
          padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 12),
          child: Column(
            children: [
              // Clock
              _DigitalClock(now: prayer.now),
              // Divider
              Container(
                height: 1,
                margin: const EdgeInsets.symmetric(vertical: 12, horizontal: 4),
                color: AppColors.border,
              ),
              // Prayer list
              Expanded(
                child: Column(
                  children: prayer.prayers
                      .map(
                        (entry) => _PrayerRow(
                          entry: entry,
                          isNext: entry.name == prayer.nextPrayer &&
                              activePrayerName == null,
                          isActive: entry.name == activePrayerName,
                        ),
                      )
                      .toList(),
                ),
              ),
              // Bottom brand
              const Text(
                '\u{1F54C} Jadzan',
                style: TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 14,
                  fontFamily: AppFontFamily.inter,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        );
      },
    );
  }
}

// ─── Digital Clock ────────────────────────────────────────────
class _DigitalClock extends StatelessWidget {
  final DateTime now;
  const _DigitalClock({required this.now});

  @override
  Widget build(BuildContext context) {
    final time =
        '${_pad(now.hour)}:${_pad(now.minute)}:${_pad(now.second)}';
    // Indonesian date format
    final date = _indonesianDate(now);
    final hijri = _formatHijri(now);

    return Column(
      children: [
        Text(
          time,
          style: const TextStyle(
            color: AppColors.textPrimary,
            fontSize: AppFontSize.h1,
            fontFamily: AppFontFamily.inter,
            fontWeight: FontWeight.w700,
            letterSpacing: 2,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          date,
          style: const TextStyle(
            color: AppColors.textSecondary,
            fontSize: 13,
            fontFamily: AppFontFamily.inter,
          ),
          textAlign: TextAlign.center,
        ),
        if (hijri.isNotEmpty) ...[
          const SizedBox(height: 4),
          Text(
            hijri,
            style: const TextStyle(
              color: AppColors.accent,
              fontSize: 12,
              fontFamily: AppFontFamily.amiri,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ],
    );
  }
}

String _indonesianDate(DateTime d) {
  const days = [
    'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu',
  ];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  final wd = days[d.weekday - 1];
  final mo = months[d.month - 1];
  return '$wd, ${d.day} $mo ${d.year}';
}

// ─── Single Prayer Row ────────────────────────────────────────
class _PrayerRow extends StatelessWidget {
  final PrayerEntry entry;
  final bool isNext;
  final bool isActive;

  const _PrayerRow({
    required this.entry,
    required this.isNext,
    required this.isActive,
  });

  @override
  Widget build(BuildContext context) {
    final bg = isActive
        ? AppColors.primary
        : isNext
            ? const Color(0x26059669) // rgba(5,150,105,0.15)
            : Colors.transparent;
    final borderColor = isNext ? AppColors.primary : Colors.transparent;
    final textColor = isActive
        ? Colors.white
        : isNext
            ? AppColors.primary
            : AppColors.textPrimary;
    final subColor =
        isActive ? const Color(0xB3FFFFFF) : AppColors.textSecondary;

    return Container(
      margin: const EdgeInsets.only(bottom: 4),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: borderColor),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                entry.label,
                style: TextStyle(
                  color: textColor,
                  fontSize: 15,
                  fontFamily: AppFontFamily.inter,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 1),
              Text(
                entry.labelAr,
                style: TextStyle(
                  color: subColor,
                  fontSize: 12,
                  fontFamily: AppFontFamily.amiri,
                ),
              ),
            ],
          ),
          Text(
            _formatTime(entry.time),
            style: TextStyle(
              color: textColor,
              fontSize: 16,
              fontFamily: AppFontFamily.inter,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}
