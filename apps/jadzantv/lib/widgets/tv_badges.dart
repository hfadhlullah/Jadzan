import 'package:flutter/material.dart';
import '../constants/app_theme.dart';

/// TV Badges — Event banner + mode badge.
/// Mirrors components/TVBadges.tsx from the React Native version.
/// Currently decorative / placeholder.

class TVBadges extends StatelessWidget {
  const TVBadges({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Event Banner
        Positioned(
          top: 150,
          right: 48,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
            decoration: BoxDecoration(
              color: const Color(0xFFE74C3C),
              borderRadius: BorderRadius.circular(9999),
              border: Border.all(
                color: Colors.white.withValues(alpha: 0.2),
                width: 2,
              ),
              boxShadow: [
                BoxShadow(
                  offset: const Offset(0, 10),
                  blurRadius: 10,
                  color: Colors.black.withValues(alpha: 0.25),
                ),
              ],
            ),
            child: const Text(
              'Maulid Nabi Muhammad SAW - 90 Hari',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontFamily: 'Inter',
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),

        // Mode Badge
        Positioned(
          top: 150,
          left: 48,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A).withValues(alpha: 0.6),
              borderRadius: BorderRadius.circular(9999),
            ),
            child: const Text(
              '🔊 Mode Muadzin',
              style: TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontFamily: 'Inter',
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ),

        // Settings Button
        Positioned(
          right: 24,
          top: 0,
          bottom: 0,
          child: Center(
            child: Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.8),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: Colors.black.withValues(alpha: 0.1),
                ),
                boxShadow: [
                  BoxShadow(
                    offset: const Offset(0, 5),
                    blurRadius: 5,
                    color: Colors.black.withValues(alpha: 0.2),
                  ),
                ],
              ),
              child: const Center(
                child: Text('⚙️', style: TextStyle(fontSize: 24)),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
