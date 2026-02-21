import 'package:flutter/material.dart';
import '../models/prayer_entry.dart';
import 'islamic_separator.dart';

/// Bottom bar for the full-display layout.
/// Glass-morphism container with prayer time boxes.
/// Mirrors components/TVBottomBar.tsx from the React Native version.

class TVBottomBar extends StatelessWidget {
  final List<PrayerEntry> prayers;
  final PrayerName? nextPrayer;
  final PrayerName? currentPrayer;

  const TVBottomBar({
    super.key,
    required this.prayers,
    this.nextPrayer,
    this.currentPrayer,
  });

  String _pad(int n) => n.toString().padLeft(2, '0');
  String _formatTime(DateTime d) => '${_pad(d.hour)}:${_pad(d.minute)}';

  String? _renderCountdown(DateTime prayerTime) {
    final diff = prayerTime.millisecondsSinceEpoch - DateTime.now().millisecondsSinceEpoch;
    if (diff <= 0) return null;

    final h = diff ~/ (1000 * 60 * 60);
    final m = (diff % (1000 * 60 * 60)) ~/ (1000 * 60);
    final s = (diff % (1000 * 60)) ~/ 1000;
    return '-${_pad(h)}:${_pad(m)}:${_pad(s)}';
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        width: MediaQuery.of(context).size.width * 0.95,
        height: 120,
        margin: const EdgeInsets.only(bottom: 32),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.95),
          borderRadius: BorderRadius.circular(30),
          border: Border.all(
            color: Colors.white.withValues(alpha: 0.5),
          ),
          boxShadow: [
            BoxShadow(
              offset: const Offset(0, -5),
              blurRadius: 15,
              color: Colors.black.withValues(alpha: 0.05),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Row(
          children: _buildChildren(),
        ),
      ),
    );
  }

  List<Widget> _buildChildren() {
    final List<Widget> children = [];

    for (int i = 0; i < prayers.length; i++) {
      final prayer = prayers[i];
      final isNext = prayer.name == nextPrayer;
      final isLast = i == prayers.length - 1;

      children.add(
        Expanded(
          flex: isNext ? 105 : 100,
          child: Container(
            height: double.infinity,
            decoration: BoxDecoration(
              color: isNext ? const Color(0xFFF59E0B) : Colors.transparent,
              boxShadow: isNext
                  ? [
                      BoxShadow(
                        blurRadius: 15,
                        color: const Color(0xFFF59E0B).withValues(alpha: 0.4),
                      )
                    ]
                  : null,
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    prayer.label,
                    style: TextStyle(
                      fontSize: isNext ? 18 : 16,
                      fontFamily: 'Montserrat',
                      fontWeight: FontWeight.w600,
                      color: isNext
                          ? Colors.white
                          : const Color(0xFF64748B),
                    ),
                    maxLines: 1,
                  ),
                ),
                const SizedBox(height: 4),
                FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    _formatTime(prayer.time),
                    style: TextStyle(
                      fontSize: isNext ? 36 : 32,
                      fontFamily: 'Montserrat',
                      fontWeight: FontWeight.bold,
                      color: isNext
                          ? Colors.white
                          : const Color(0xFF1E293B),
                    ),
                    maxLines: 1,
                  ),
                ),
                if (isNext) ...[
                  const SizedBox(height: 4),
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Text(
                      _renderCountdown(prayer.time) ?? '',
                      style: const TextStyle(
                        fontSize: 12,
                        fontFamily: 'Montserrat',
                        fontWeight: FontWeight.w500,
                        color: Colors.white,
                      ),
                      maxLines: 1,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      );

      // Add separator between non-active items
      if (!isLast && !isNext) {
        final nextItem = prayers[i + 1];
        final nextIsActive = nextItem.name == nextPrayer;
        if (!nextIsActive) {
          children.add(
            const SizedBox(
              width: 1,
              child: IslamicSeparator(
                width: 1,
                heightFactor: 0.8,
                ornament: '❖',
              ),
            ),
          );
        }
      }
    }

    return children;
  }
}
