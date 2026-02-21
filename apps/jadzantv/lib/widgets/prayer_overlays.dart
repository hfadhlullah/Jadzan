import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:audioplayers/audioplayers.dart';
import '../constants/app_theme.dart';
import '../models/prayer_entry.dart';
import '../providers/prayer_provider.dart';

String _pad(int n) => n.toString().padLeft(2, '0');

String _formatCountdown(int seconds) {
  final m = seconds ~/ 60;
  final s = seconds % 60;
  return '${_pad(m)}:${_pad(s)}';
}

/// Main prayer overlays widget.
/// Mirrors components/PrayerOverlays.tsx from the React Native version.
class PrayerOverlays extends StatelessWidget {
  const PrayerOverlays({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<PrayerProvider>(
      builder: (context, prayer, _) {
        final activeName = prayer.currentPrayer ?? prayer.nextPrayer;
        final activeEntry = prayer.prayers.cast<PrayerEntry?>().firstWhere(
              (p) => p?.name == activeName,
              orElse: () => null,
            );
        final prayerLabel = activeEntry?.label ?? '';
        final prayerLabelAr = activeEntry?.labelAr ?? '';

        switch (prayer.displayState) {
          case DisplayState.approaching:
            return _ApproachingOverlay(
              prayerLabel: prayerLabel,
              countdown: prayer.countdown,
            );
          case DisplayState.adzan:
            return _AdzanOverlay(
              prayerLabel: prayerLabel,
              prayerLabelAr: prayerLabelAr,
            );
          case DisplayState.iqomah:
            return _IqomahOverlay(
              countdown: prayer.countdown,
              prayerLabel: prayerLabel,
            );
          case DisplayState.prayer:
            return _PrayerOverlay(prayerLabel: prayerLabel);
          case DisplayState.idle:
            return const SizedBox.shrink();
        }
      },
    );
  }
}

// ─── Approaching Warning ──────────────────────────────────────
class _ApproachingOverlay extends StatefulWidget {
  final String prayerLabel;
  final int countdown;

  const _ApproachingOverlay({
    required this.prayerLabel,
    required this.countdown,
  });

  @override
  State<_ApproachingOverlay> createState() => _ApproachingOverlayState();
}

class _ApproachingOverlayState extends State<_ApproachingOverlay>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat(reverse: true);
    _scaleAnim = Tween<double>(begin: 1.0, end: 1.04).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: 20,
      right: 20,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        decoration: BoxDecoration(
          color: const Color(0x1AD97706), // rgba(217,119,6,0.1)
          borderRadius: BorderRadius.circular(30), // Pill shaped
          border: Border.all(
            color: const Color(0x33D97706), // rgba(217,119,6,0.2)
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            ScaleTransition(
              scale: _scaleAnim,
              child: const Text('\u{1F514}', style: TextStyle(fontSize: 16)),
            ),
            const SizedBox(width: 8),
            Text.rich(
              TextSpan(
                text: 'Menuju ${widget.prayerLabel} ',
                style: const TextStyle(
                  color: Color(0xFF1E293B),
                  fontSize: 14,
                  fontFamily: AppFontFamily.montserrat,
                  fontWeight: FontWeight.w600,
                ),
                children: [
                  TextSpan(
                    text: _formatCountdown(widget.countdown),
                    style: const TextStyle(color: AppColors.accent),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Adzan Full-Screen ────────────────────────────────────────
class _AdzanOverlay extends StatefulWidget {
  final String prayerLabel;
  final String prayerLabelAr;

  const _AdzanOverlay({
    required this.prayerLabel,
    required this.prayerLabelAr,
  });

  @override
  State<_AdzanOverlay> createState() => _AdzanOverlayState();
}

class _AdzanOverlayState extends State<_AdzanOverlay>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    )..repeat(reverse: true);
    _scaleAnim = Tween<double>(begin: 1.0, end: 1.05).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: Container(
        color: const Color(0xFF020617),
        padding: const EdgeInsets.symmetric(vertical: 40),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Title
            const Text(
              'Adzan',
              style: TextStyle(
                color: AppColors.accent,
                fontSize: 24,
                fontFamily: AppFontFamily.montserrat,
                fontWeight: FontWeight.w700,
                letterSpacing: 10,
              ),
            ),
            const SizedBox(height: 30),
            // Pulsing prayer name
            ScaleTransition(
              scale: _scaleAnim,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 40),
                child: Column(
                  children: [
                    FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Text(
                        widget.prayerLabel,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 100,
                          fontFamily: AppFontFamily.amiri,
                          fontWeight: FontWeight.w700,
                          height: 1.2,
                        ),
                        maxLines: 1,
                      ),
                    ),
                    const SizedBox(height: 10),
                    FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Text(
                        widget.prayerLabelAr,
                        style: const TextStyle(
                          color: AppColors.accent,
                          fontSize: 70,
                          fontFamily: AppFontFamily.amiri,
                        ),
                        maxLines: 1,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 30),
            // Subtitle
            FittedBox(
              fit: BoxFit.scaleDown,
              child: const Text(
                'Waktu shalat telah tiba',
                style: TextStyle(
                  color: Color(0xFF94A3B8),
                  fontSize: 28,
                  fontFamily: AppFontFamily.montserrat,
                  fontWeight: FontWeight.w600,
                ),
                maxLines: 1,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Iqomah Countdown ────────────────────────────────────────
const String _beepUri =
    'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';
const String _finalUri =
    'https://actions.google.com/sounds/v1/alarms/mechanical_clock_ring.ogg';

class _IqomahOverlay extends StatefulWidget {
  final int countdown;
  final String prayerLabel;

  const _IqomahOverlay({
    required this.countdown,
    required this.prayerLabel,
  });

  @override
  State<_IqomahOverlay> createState() => _IqomahOverlayState();
}

class _IqomahOverlayState extends State<_IqomahOverlay> {
  final AudioPlayer _beepPlayer = AudioPlayer();
  final AudioPlayer _finalPlayer = AudioPlayer();
  int? _lastPlayed;

  @override
  void initState() {
    super.initState();
    _preloadSounds();
  }

  Future<void> _preloadSounds() async {
    try {
      await _beepPlayer.setSource(UrlSource(_beepUri));
      await _finalPlayer.setSource(UrlSource(_finalUri));
    } catch (e) {
      debugPrint('[IqomahOverlay] Failed to load sounds: $e');
    }
  }

  @override
  void didUpdateWidget(covariant _IqomahOverlay oldWidget) {
    super.didUpdateWidget(oldWidget);
    _handleSound();
  }

  Future<void> _handleSound() async {
    if (_lastPlayed == widget.countdown) return;
    try {
      if (widget.countdown > 0 && widget.countdown <= 5) {
        _lastPlayed = widget.countdown;
        await _beepPlayer.stop();
        await _beepPlayer.play(UrlSource(_beepUri));
      } else if (widget.countdown == 0) {
        _lastPlayed = widget.countdown;
        await _finalPlayer.stop();
        await _finalPlayer.play(UrlSource(_finalUri));
      }
    } catch (e) {
      debugPrint('[IqomahOverlay] Audio play error: $e');
    }
  }

  @override
  void dispose() {
    _beepPlayer.dispose();
    _finalPlayer.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isUrgent = widget.countdown <= 60;
    final color = widget.countdown > 300
        ? AppColors.primary
        : widget.countdown > 60
            ? AppColors.accent
            : AppColors.danger;

    return Positioned.fill(
      child: Container(
        color: const Color(0xFF020617),
        padding: const EdgeInsets.symmetric(vertical: 40),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Label
            FittedBox(
              fit: BoxFit.scaleDown,
              child: Text(
                'Iqomah ${widget.prayerLabel}',
                style: const TextStyle(
                  color: Color(0xFF94A3B8),
                  fontSize: 28,
                  fontFamily: AppFontFamily.montserrat,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 4,
                ),
                maxLines: 1,
              ),
            ),
            const SizedBox(height: 30),
            // Timer
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 40),
              child: FittedBox(
                fit: BoxFit.scaleDown,
                child: Text(
                  _formatCountdown(widget.countdown),
                  style: TextStyle(
                    color: color,
                    fontSize: 160,
                    fontFamily: AppFontFamily.montserrat,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 8,
                    height: 1.125, // lineHeight 180 / fontSize 160
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 1,
                ),
              ),
            ),
            const SizedBox(height: 30),
            // Sub text
            FittedBox(
              fit: BoxFit.scaleDown,
              child: Text(
                isUrgent
                    ? '\u26A0 Harap segera berwudhu'
                    : 'Bersiap untuk shalat',
                style: const TextStyle(
                  color: Color(0xFF94A3B8),
                  fontSize: 28,
                  fontFamily: AppFontFamily.montserrat,
                  fontWeight: FontWeight.w600,
                ),
                maxLines: 1,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Prayer / Silence ────────────────────────────────────────
class _PrayerOverlay extends StatelessWidget {
  final String prayerLabel;

  const _PrayerOverlay({required this.prayerLabel});

  static const String _patternUrl =
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC51TgieKu6GyK9K1DTB21-J0ZsSqHDkIeOkebmvnOSphOufWQG-p75CzCzbNv42S2954DewNiHGu8xr0fFNirgscuZgoQjyH5lfXTw4EPkj5G54-b3ki0Y42SK2kszzPSXdxSPaxImmgSUud0s0SopMudy8kR7mImym5eOx3Kkc45oQZCpvcluxguLwJahU6wRu1niF6AR6hfwSmViCOQ1QRy9CgT9o6565AEgzNzOMPCNQJ31syhOPPnwzd8FZ6JJpSrFxliuEh7w';

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: Container(
        color: const Color(0xFF020617),
        padding: const EdgeInsets.symmetric(vertical: 40),
        child: Stack(
          children: [
            // Pattern overlay
            Positioned.fill(
              child: Opacity(
                opacity: 0.1,
                child: Image.network(
                  _patternUrl,
                  fit: BoxFit.cover,
                  color: AppColors.primary,
                  colorBlendMode: BlendMode.srcIn,
                  errorBuilder: (_, __, ___) => const SizedBox.shrink(),
                ),
              ),
            ),
            // Content
            Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 40),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Arabic text
                    FittedBox(
                      fit: BoxFit.scaleDown,
                      child: const Text(
                        '\u0627\u0633\u062A\u0648\u0648\u0627 \u0648\u0627\u0639\u062A\u062F\u0644\u0648\u0627',
                        style: TextStyle(
                          color: AppColors.primary,
                          fontSize: 50,
                          fontFamily: AppFontFamily.amiri,
                        ),
                        maxLines: 1,
                      ),
                    ),
                    const SizedBox(height: 10),
                    // Title
                    FittedBox(
                      fit: BoxFit.scaleDown,
                      child: const Text(
                        'SHOLAT SEDANG BERLANGSUNG',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 40,
                          fontFamily: AppFontFamily.montserrat,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 6,
                        ),
                        textAlign: TextAlign.center,
                        maxLines: 1,
                      ),
                    ),
                    const SizedBox(height: 8),
                    // Sub text
                    FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Text(
                        '$prayerLabel \u00B7 Harap tenang & matikan ponsel',
                        style: const TextStyle(
                          color: Color(0xFF94A3B8),
                          fontSize: 28,
                          fontFamily: AppFontFamily.montserrat,
                          fontWeight: FontWeight.w600,
                        ),
                        maxLines: 1,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
