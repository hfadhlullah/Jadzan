import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../constants/app_theme.dart';
import '../models/prayer_entry.dart';
import '../models/mosque_config.dart';
import '../services/supabase_client.dart';
import '../services/storage_service.dart';
import '../providers/prayer_provider.dart';
import '../widgets/side_top_bar.dart';
import '../widgets/side_prayer_list.dart';
import '../widgets/media_carousel.dart';
import '../widgets/news_ticker.dart';
import '../widgets/prayer_overlays.dart';

/// Side-display layout (30/70 split).
/// Mirrors app/side-display.tsx from the React Native version.
class SideDisplayScreen extends StatefulWidget {
  const SideDisplayScreen({super.key});

  @override
  State<SideDisplayScreen> createState() => _SideDisplayScreenState();
}

class _SideDisplayScreenState extends State<SideDisplayScreen> {
  MosqueConfig? _config;
  String? _error;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadConfig();
  }

  @override
  void dispose() {
    Provider.of<PrayerProvider>(context, listen: false).stopEngine();
    super.dispose();
  }

  Future<void> _loadConfig() async {
    try {
      final mosqueId = await StorageService.getMosqueId();
      if (mosqueId == null) {
        if (mounted) {
          setState(() {
            _error = 'No mosque linked.';
            _loading = false;
          });
        }
        return;
      }

      Map<String, dynamic> data;
      try {
        // Try fetching from Supabase
        data = await SupabaseConfig.client
            .from('mosques')
            .select(
                'latitude,longitude,calculation_method,iqomah_delays,name,address,background_url,arabesque_opacity,hijri_adjustment')
            .eq('id', mosqueId)
            .single();
        // Save to cache for offline use
        await StorageService.saveMosqueConfig(data);
      } catch (_) {
        // Supabase unreachable — try local cache
        final cached = await StorageService.loadMosqueConfig();
        if (cached == null) {
          if (mounted) {
            setState(() {
              _error = 'No internet and no cached config. Please connect once to load mosque data.';
              _loading = false;
            });
          }
          return;
        }
        data = cached;
      }

      if (!mounted) return;
      final config = MosqueConfig.fromJson(data);
      setState(() {
        _config = config;
        _loading = false;
      });

      Provider.of<PrayerProvider>(context, listen: false).startEngine(
        lat: config.latitude,
        lng: config.longitude,
        method: config.calculationMethod,
        iqomahDelays: config.iqomahDelays,
      );
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString();
          _loading = false;
        });
      }
    }
  }

  String _pad(int n) => n.toString().padLeft(2, '0');

  @override
  Widget build(BuildContext context) {
    if (_error != null) {
      return Scaffold(
        backgroundColor: const Color(0xFFF8FAFC),
        body: Center(
          child: Text(
            _error!,
            style: const TextStyle(
              color: Color(0xFFEF4444),
              fontSize: 14,
              fontFamily: AppFontFamily.montserrat,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      );
    }

    if (_loading || _config == null) {
      return const Scaffold(
        backgroundColor: Color(0xFFF8FAFC),
        body: Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: Consumer<PrayerProvider>(
        builder: (context, prayer, _) {
          // Display state as string for SidePrayerList
          final dsString = switch (prayer.displayState) {
            DisplayState.idle => 'IDLE',
            DisplayState.approaching => 'APPROACHING',
            DisplayState.adzan => 'ADZAN',
            DisplayState.iqomah => 'IQOMAH',
            DisplayState.prayer => 'PRAYER',
          };

          // Build countdown label for status pill
          String countdownLabel = '';
          final nextEntry = prayer.prayers.cast<PrayerEntry?>().firstWhere(
                (p) => p?.name == prayer.nextPrayer,
                orElse: () => null,
              );
          if (nextEntry != null) {
            final hh = prayer.countdown ~/ 3600;
            final mm = (prayer.countdown % 3600) ~/ 60;
            final ss = prayer.countdown % 60;
            countdownLabel =
                '${nextEntry.label} -${_pad(hh)}:${_pad(mm)}:${_pad(ss)}';
          }

          return Stack(
            children: [
              Column(
                children: [
                  // Top Bar
                  SideTopBar(
                    now: prayer.now,
                    mosqueName: _config!.name,
                    mosqueAddress: _config!.address ?? '',
                    calculationMethod: _config!.calculationMethod,
                    hijriAdjustment: _config!.hijriAdjustment,
                  ),

                  // Body: 30/70 split
                  Expanded(
                    child: Row(
                      children: [
                        // Left sidebar: Prayer List (30%)
                        SizedBox(
                          width: MediaQuery.of(context).size.width * 0.30,
                          child: Container(
                            decoration: const BoxDecoration(
                              color: Colors.white,
                              border: Border(
                                right: BorderSide(
                                  color: Color(0xFFF1F5F9),
                                  width: 1,
                                ),
                              ),
                            ),
                            child: Stack(
                              children: [
                                SidePrayerList(
                                  prayers: prayer.prayers,
                                  nextPrayer: prayer.nextPrayer,
                                  currentPrayer: prayer.currentPrayer,
                                  displayState: dsString,
                                  now: prayer.now,
                                ),
                                // Footer text
                                const Positioned(
                                  bottom: 10,
                                  left: 20,
                                  child: Text(
                                    '',
                                    style: TextStyle(
                                      fontSize: 10,
                                      color: Color(0xFF94A3B8),
                                      fontFamily: AppFontFamily.montserrat,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),

                        // Right content: Media Area (70%)
                        Expanded(
                          child: Container(
                            decoration: const BoxDecoration(
                              color: Color(0xFF0F172A),
                              border: Border(
                                top: BorderSide(
                                  color: Color(0xFFF1F5F9),
                                  width: 1,
                                ),
                              ),
                            ),
                            child: Stack(
                              children: [
                                // Background image
                                Positioned.fill(
                                  child: Image.network(
                                    _config!.backgroundUrl ??
                                        'https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=2070',
                                    fit: BoxFit.cover,
                                    errorBuilder: (_, __, ___) =>
                                        const SizedBox.shrink(),
                                  ),
                                ),

                                // Media carousel on top
                                const Positioned.fill(
                                  child: MediaCarousel(),
                                ),

                                // Status pill
                                if (countdownLabel.isNotEmpty)
                                  Positioned(
                                    bottom: 20,
                                    left: 20,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                        vertical: 8,
                                        horizontal: 20,
                                      ),
                                      decoration: BoxDecoration(
                                        color: const Color(0xF2FFFFFF),
                                        borderRadius:
                                            BorderRadius.circular(20),
                                        boxShadow: const [
                                          BoxShadow(
                                            color: Color(0x1A000000),
                                            blurRadius: 4,
                                            offset: Offset(0, 2),
                                          ),
                                        ],
                                      ),
                                      child: Text(
                                        countdownLabel,
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontFamily: AppFontFamily.montserrat,
                                          fontWeight: FontWeight.w600,
                                          color: Color(0xFF1E293B),
                                        ),
                                        maxLines: 1,
                                      ),
                                    ),
                                  ),

                                // FAB to switch to full layout
                                Positioned(
                                  top: 20,
                                  right: 20,
                                  child: _LayoutSwitchButton(
                                    label: 'FULL',
                                    onPressed: () {
                                      Navigator.of(context)
                                          .pushReplacementNamed('/full-display');
                                    },
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Footer Ticker
                  const NewsTicker(),
                ],
              ),

              // Global overlays
              const PrayerOverlays(),
            ],
          );
        },
      ),
    );
  }
}

/// A focusable button for TV remote navigation.
/// Uses [Focus] so the D-pad/Enter key can select it.
class _LayoutSwitchButton extends StatefulWidget {
  final String label;
  final VoidCallback onPressed;
  const _LayoutSwitchButton({required this.label, required this.onPressed});

  @override
  State<_LayoutSwitchButton> createState() => _LayoutSwitchButtonState();
}

class _LayoutSwitchButtonState extends State<_LayoutSwitchButton> {
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    return Focus(
      autofocus: true,
      onFocusChange: (focused) => setState(() => _focused = focused),
      onKeyEvent: (node, event) {
        if (event is KeyDownEvent &&
            (event.logicalKey == LogicalKeyboardKey.select ||
             event.logicalKey == LogicalKeyboardKey.enter ||
             event.logicalKey == LogicalKeyboardKey.gameButtonA)) {
          widget.onPressed();
          return KeyEventResult.handled;
        }
        return KeyEventResult.ignored;
      },
      child: GestureDetector(
        onTap: widget.onPressed,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            color: _focused ? const Color(0xCC000000) : const Color(0x80000000),
            borderRadius: BorderRadius.circular(28),
            border: Border.all(
              color: _focused ? Colors.white : const Color(0x4DFFFFFF),
              width: _focused ? 2 : 1,
            ),
            boxShadow: _focused
                ? [const BoxShadow(color: Color(0x66FFFFFF), blurRadius: 8, spreadRadius: 2)]
                : [],
          ),
          alignment: Alignment.center,
          child: Text(
            widget.label,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 11,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }
}
