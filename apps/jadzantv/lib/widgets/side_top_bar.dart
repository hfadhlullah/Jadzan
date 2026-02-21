import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:hijri/hijri_calendar.dart';
import '../constants/app_theme.dart';

/// Top bar for the side-display layout.
/// Mirrors components/SideTopBar.tsx from the React Native version.
class SideTopBar extends StatelessWidget {
  final DateTime now;
  final String mosqueName;
  final String mosqueAddress;
  final int hijriAdjustment;
  final String? calculationMethod;

  const SideTopBar({
    super.key,
    required this.now,
    required this.mosqueName,
    required this.mosqueAddress,
    this.hijriAdjustment = 0,
    this.calculationMethod,
  });

  String _pad(int n) => n.toString().padLeft(2, '0');

  String _formatGregorianDate() {
    try {
      return DateFormat('EEEE, d MMMM yyyy', 'id_ID').format(now);
    } catch (_) {
      return DateFormat('EEEE, d MMMM yyyy').format(now);
    }
  }

  String _formatHijriDate() {
    final baseOffset = calculationMethod == 'KEMENAG' ? -1 : 0;
    final totalOffset = baseOffset + hijriAdjustment;
    final adjustedDate = now.add(Duration(days: totalOffset));
    final hijri = HijriCalendar.fromDate(adjustedDate);
    return '${hijri.hDay} ${hijri.longMonthName} ${hijri.hYear}';
  }

  @override
  Widget build(BuildContext context) {
    final timeStr = '${_pad(now.hour)}:${_pad(now.minute)}';
    final gregorianDate = _formatGregorianDate();
    final hijriDate = _formatHijriDate();

    return Container(
      height: 80,
      padding: const EdgeInsets.symmetric(horizontal: 40),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(
          bottom: BorderSide(color: Color(0xFFF1F5F9), width: 1),
        ),
      ),
      child: Row(
        children: [
          // Left: Clock
          Text(
            timeStr,
            style: const TextStyle(
              fontSize: 48,
              fontFamily: AppFontFamily.montserrat,
              fontWeight: FontWeight.w700,
              color: Color(0xFF1E293B),
            ),
            maxLines: 1,
          ),
          // Divider
          const _VerticalIslamicSeparator(),
          // Center: Mosque Info
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    mosqueName,
                    style: const TextStyle(
                      fontSize: 24,
                      fontFamily: AppFontFamily.montserrat,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF0F172A),
                    ),
                    maxLines: 1,
                    textAlign: TextAlign.center,
                  ),
                ),
                FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    mosqueAddress,
                    style: const TextStyle(
                      fontSize: 14,
                      fontFamily: AppFontFamily.montserrat,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF64748B),
                    ),
                    maxLines: 1,
                    textAlign: TextAlign.center,
                  ),
                ),
              ],
            ),
          ),
          // Divider
          const _VerticalIslamicSeparator(),
          // Right: Date
          SizedBox(
            width: 280,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    gregorianDate,
                    style: const TextStyle(
                      fontSize: 20,
                      fontFamily: AppFontFamily.montserrat,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF1E293B),
                    ),
                    maxLines: 1,
                    textAlign: TextAlign.right,
                  ),
                ),
                FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    hijriDate,
                    style: const TextStyle(
                      fontSize: 16,
                      fontFamily: AppFontFamily.montserrat,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF64748B),
                    ),
                    maxLines: 1,
                    textAlign: TextAlign.right,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Vertical separator with diamond ornament.
class _VerticalIslamicSeparator extends StatelessWidget {
  const _VerticalIslamicSeparator();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 60,
      margin: const EdgeInsets.symmetric(horizontal: 10),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Expanded(
            child: Center(
              child: Container(
                width: 1.5,
                height: double.infinity,
                color: const Color(0x4DD97706), // rgba(217, 119, 6, 0.3)
              ),
            ),
          ),
          const Text(
            '\u25C6', // ◆
            style: TextStyle(
              fontSize: 14,
              color: Color(0xFFD97706),
              height: 1,
            ),
          ),
          Expanded(
            child: Center(
              child: Container(
                width: 1.5,
                height: double.infinity,
                color: const Color(0x4DD97706),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

