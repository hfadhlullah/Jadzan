import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:hijri/hijri_calendar.dart';
import 'islamic_separator.dart';

/// Top bar for the full-display layout.
/// Glass-morphism container (95% width, 100px, rounded bottom).
/// Mirrors components/TVTopBar.tsx from the React Native version.

class TVTopBar extends StatelessWidget {
  final DateTime now;
  final String mosqueName;
  final String mosqueAddress;
  final String? calculationMethod;
  final int hijriAdjustment;

  const TVTopBar({
    super.key,
    required this.now,
    required this.mosqueName,
    required this.mosqueAddress,
    this.calculationMethod,
    this.hijriAdjustment = 0,
  });

  String _formatTime() {
    return '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}';
  }

  String _formatGregorianDate() {
    // Indonesian locale: "Kamis, 1 Februari 2024"
    try {
      return DateFormat('EEEE, d MMMM yyyy', 'id_ID').format(now);
    } catch (_) {
      return DateFormat('EEEE, d MMMM yyyy').format(now);
    }
  }

  String _formatHijriDate() {
    // Calculate Hijri date with combined adjustments
    final baseOffset = calculationMethod == 'KEMENAG' ? -1 : 0;
    final totalOffset = baseOffset + hijriAdjustment;
    final adjustedDate = now.add(Duration(days: totalOffset));
    final hijri = HijriCalendar.fromDate(adjustedDate);
    return '${hijri.hDay} ${hijri.longMonthName} ${hijri.hYear}';
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        width: MediaQuery.of(context).size.width * 0.95,
        height: 100,
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.95),
          borderRadius: const BorderRadius.only(
            bottomLeft: Radius.circular(30),
            bottomRight: Radius.circular(30),
          ),
          border: Border.all(
            color: Colors.white.withValues(alpha: 0.5),
          ),
          boxShadow: [
            BoxShadow(
              offset: const Offset(0, 5),
              blurRadius: 15,
              color: Colors.black.withValues(alpha: 0.05),
            ),
          ],
        ),
        padding: const EdgeInsets.symmetric(horizontal: 40),
        child: Row(
          children: [
            // Clock Section
            Center(
              child: FittedBox(
                fit: BoxFit.scaleDown,
                child: Text(
                  _formatTime(),
                  style: const TextStyle(
                    fontSize: 60,
                    fontFamily: 'Montserrat',
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1E293B),
                  ),
                ),
              ),
            ),

            const IslamicSeparator(width: 30, heightFactor: 0.5),

            // Mosque Info
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
                        fontFamily: 'Montserrat',
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1E293B),
                      ),
                      maxLines: 1,
                    ),
                  ),
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Text(
                      mosqueAddress,
                      style: const TextStyle(
                        fontSize: 14,
                        fontFamily: 'Montserrat',
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF64748B),
                      ),
                      maxLines: 1,
                    ),
                  ),
                ],
              ),
            ),

            const IslamicSeparator(width: 30, heightFactor: 0.5),

            // Dates Section
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    _formatGregorianDate(),
                    style: const TextStyle(
                      fontSize: 20,
                      fontFamily: 'Montserrat',
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1E293B),
                    ),
                    maxLines: 1,
                  ),
                ),
                const SizedBox(height: 4),
                FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    _formatHijriDate(),
                    style: const TextStyle(
                      fontSize: 16,
                      fontFamily: 'Montserrat',
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF64748B),
                    ),
                    maxLines: 1,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
