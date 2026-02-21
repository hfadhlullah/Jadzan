import 'package:flutter/material.dart';
import '../constants/app_theme.dart';
import '../models/prayer_entry.dart';

/// Color themes per prayer.
const Map<PrayerName, ({Color bg, Color text})> _prayerThemes = {
  PrayerName.imsak: (bg: Color(0xFF10B981), text: Colors.white),
  PrayerName.fajr: (bg: Color(0xFF3B82F6), text: Colors.white),
  PrayerName.sunrise: (bg: Color(0xFF0D9488), text: Colors.white),
  PrayerName.dhuhr: (bg: Color(0xFFF59E0B), text: Colors.white),
  PrayerName.asr: (bg: Color(0xFF9333EA), text: Colors.white),
  PrayerName.maghrib: (bg: Color(0xFFEA580C), text: Colors.white),
  PrayerName.isha: (bg: Color(0xFF1E3A8A), text: Colors.white),
};

/// Side prayer list for the side-display layout.
/// Mirrors components/SidePrayerList.tsx from the React Native version.
class SidePrayerList extends StatelessWidget {
  final List<PrayerEntry> prayers;
  final PrayerName? nextPrayer;
  final PrayerName? currentPrayer;
  final String displayState;
  final DateTime now;

  const SidePrayerList({
    super.key,
    required this.prayers,
    required this.nextPrayer,
    required this.currentPrayer,
    required this.displayState,
    required this.now,
  });

  @override
  Widget build(BuildContext context) {
    final activePrayerName =
        (displayState == 'ADZAN' ||
                displayState == 'IQOMAH' ||
                displayState == 'PRAYER')
            ? currentPrayer
            : null;

    // Build list of items, tracking which separators are hidden
    final items = <({Widget child, int flex})>[];
    for (int index = 0; index < prayers.length; index++) {
      final entry = prayers[index];
      final isHighlight = entry.name == activePrayerName ||
          (activePrayerName == null && entry.name == nextPrayer);
      final theme = _prayerThemes[entry.name] ??
          (bg: const Color(0xFF10B981), text: Colors.white);

      // Prayer row: flex 55
      items.add((
        child: _PrayerRow(entry: entry, isHighlight: isHighlight, theme: theme),
        flex: 55,
      ));

      // Separator after each row except last
      if (index < prayers.length - 1) {
        final nextEntry = prayers[index + 1];
        final nextHighlight = nextEntry.name == activePrayerName ||
            (activePrayerName == null && nextEntry.name == nextPrayer);
        final showSeparator = !isHighlight && !nextHighlight;
        // Separator: flex 9 (roughly 8px margin + 1px line)
        items.add((
          child: showSeparator
              ? const _IslamicSeparator()
              : const SizedBox.shrink(),
          flex: 9,
        ));
      }
    }

    return Container(
      width: double.infinity,
      height: double.infinity,
      color: Colors.white,
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Column(
        mainAxisSize: MainAxisSize.max,
        children: items
            .map((item) => Expanded(flex: item.flex, child: item.child))
            .toList(),
      ),
    );
  }
}

String _pad(int n) => n.toString().padLeft(2, '0');
String _formatTime(DateTime date) =>
    '${_pad(date.hour)}:${_pad(date.minute)}';

class _PrayerRow extends StatelessWidget {
  final PrayerEntry entry;
  final bool isHighlight;
  final ({Color bg, Color text}) theme;

  const _PrayerRow({
    required this.entry,
    required this.isHighlight,
    required this.theme,
  });

  @override
  Widget build(BuildContext context) {
    final timeColor = isHighlight ? Colors.white : const Color(0xFF0F172A);

    return Container(
      height: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 32),
      decoration: BoxDecoration(
        color: isHighlight ? theme.bg : Colors.white,
        border: isHighlight
            ? Border.all(color: theme.bg)
            : null,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Name badge or plain text
          if (!isHighlight)
            Container(
              padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 24),
              decoration: BoxDecoration(
                color: theme.bg,
                borderRadius: BorderRadius.circular(20),
              ),
              constraints: const BoxConstraints(minWidth: 100),
              alignment: Alignment.center,
              child: Text(
                entry.label,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontFamily: AppFontFamily.montserrat,
                  fontWeight: FontWeight.w600,
                ),
                maxLines: 1,
              ),
            )
          else
            Text(
              entry.label,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontFamily: AppFontFamily.montserrat,
                fontWeight: FontWeight.w600,
              ),
              maxLines: 1,
            ),
          // Time
          Text(
            _formatTime(entry.time),
            style: TextStyle(
              color: timeColor,
              fontSize: 32,
              fontFamily: AppFontFamily.montserrat,
              fontWeight: FontWeight.w700,
            ),
            maxLines: 1,
          ),
        ],
      ),
    );
  }
}

class _IslamicSeparator extends StatelessWidget {
  const _IslamicSeparator();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 48),
        child: Row(
          children: [
            Expanded(
              child: Container(height: 1, color: const Color(0xFFF1F5F9)),
            ),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 12),
              child: Text(
                '\u2756', // ❖
                style: TextStyle(
                  fontSize: 10,
                  color: Color(0xFFD1D5DB),
                ),
              ),
            ),
            Expanded(
              child: Container(height: 1, color: const Color(0xFFF1F5F9)),
            ),
          ],
        ),
      ),
    );
  }
}
