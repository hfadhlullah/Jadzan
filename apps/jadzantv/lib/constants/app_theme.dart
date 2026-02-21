import 'package:flutter/material.dart';

/// Design tokens for the Jadzan TV App
/// Matches docs/design-system.md from the React Native version

class AppColors {
  AppColors._();

  static const Color primary = Color(0xFF059669);       // Emerald Green
  static const Color primaryHover = Color(0xFF047857);
  static const Color accent = Color(0xFFD97706);         // Gold / Amber
  static const Color accentHover = Color(0xFFB45309);

  static const Color background = Color(0xFF0F172A);     // Rich near-black
  static const Color surface = Color(0xFF1E293B);        // Card / sidebar surface
  static const Color surfaceHover = Color(0xFF273549);

  static const Color textPrimary = Color(0xFFF8FAFC);
  static const Color textSecondary = Color(0xFF94A3B8);

  static const Color border = Color(0xFF334155);

  static const Color success = Color(0xFF059669);
  static const Color warning = Color(0xFFD97706);
  static const Color danger = Color(0xFFDC2626);

  // Full Screen UI Tokens
  static const Color nextPrayerHighlight = Color(0xFFF59E0B); // Amber 500
  static const Color barBackground = Color(0xA60F172A);       // rgba(15, 23, 42, 0.65)
  static const Color glassBackground = Color(0x26FFFFFF);     // rgba(255, 255, 255, 0.15)
  static const Color clockBackground = Color(0xD9F8FAFC);    // rgba(248, 250, 252, 0.85)
}

class AppFontSize {
  AppFontSize._();

  static const double displayXL = 96;   // Current time
  static const double display = 64;     // Iqomah countdown
  static const double h1 = 48;          // Prayer name
  static const double h2 = 36;
  static const double body = 24;        // News ticker
  static const double caption = 16;     // Metadata, Hijri date
}

class AppFontFamily {
  AppFontFamily._();

  static const String inter = 'Inter';
  static const String amiri = 'Amiri';
  static const String googleSans = 'GoogleSans';
  static const String montserrat = 'Montserrat';
}

class AppSpacing {
  AppSpacing._();

  static const double xs = 4;
  static const double sm = 8;
  static const double md = 16;
  static const double lg = 24;
  static const double xl = 32;
  static const double xxl = 48;
}

class AppLayout {
  AppLayout._();

  static const double sidebarWidthPercent = 0.25;   // Zone A — Prayer sidebar (25%)
  static const double mediaStageWidthPercent = 0.75; // Zone B — Media carousel (75%)
  static const double tickerHeight = 40;              // Zone C — News ticker (px)

  // Full Screen UI
  static const double topBarHeight = 100;
  static const double bottomBarHeight = 120;
}
