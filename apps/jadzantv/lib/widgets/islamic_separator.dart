import 'package:flutter/material.dart';

/// Reusable Islamic separator — vertical gold lines with a diamond ornament.
/// Used in TVTopBar, TVBottomBar, SideTopBar, SidePrayerList.
/// Mirrors the inline IslamicSeparator components from the React Native version.

class IslamicSeparator extends StatelessWidget {
  final double width;
  final double heightFactor; // fraction of parent height
  final String ornament;
  final bool isHorizontal; // for horizontal separators (between prayer rows)

  const IslamicSeparator({
    super.key,
    this.width = 30,
    this.heightFactor = 0.5,
    this.ornament = '◆',
    this.isHorizontal = false,
  });

  @override
  Widget build(BuildContext context) {
    if (isHorizontal) {
      return _buildHorizontal();
    }
    return _buildVertical();
  }

  Widget _buildVertical() {
    return SizedBox(
      width: width,
      child: FractionallySizedBox(
        heightFactor: heightFactor,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Expanded(
              child: Container(
                width: 1.5,
                color: const Color(0xFFD97706).withValues(alpha: 0.3),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Text(
                ornament,
                style: TextStyle(
                  fontSize: 10,
                  color: const Color(0xFFD97706).withValues(alpha: 0.5),
                  height: 1,
                ),
              ),
            ),
            Expanded(
              child: Container(
                width: 1.5,
                color: const Color(0xFFD97706).withValues(alpha: 0.3),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHorizontal() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 48, vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Expanded(
            child: Container(
              height: 1,
              color: const Color(0xFFF1F5F9),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Text(
              ornament,
              style: TextStyle(
                fontSize: 10,
                color: const Color(0xFFD1D5DB).withValues(alpha: 0.5),
              ),
            ),
          ),
          Expanded(
            child: Container(
              height: 1,
              color: const Color(0xFFF1F5F9),
            ),
          ),
        ],
      ),
    );
  }
}
