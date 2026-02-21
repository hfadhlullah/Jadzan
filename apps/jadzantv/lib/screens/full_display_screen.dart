import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../constants/app_theme.dart';
import '../models/prayer_entry.dart';
import '../models/mosque_config.dart';
import '../services/supabase_client.dart';
import '../services/storage_service.dart';
import '../providers/prayer_provider.dart';
import '../widgets/tv_top_bar.dart';
import '../widgets/tv_bottom_bar.dart';
import '../widgets/news_ticker.dart';
import '../widgets/media_carousel.dart';
import '../widgets/prayer_overlays.dart';

/// Full-screen display layout.
/// Mirrors app/full-display.tsx from the React Native version.
class FullDisplayScreen extends StatefulWidget {
  const FullDisplayScreen({super.key});

  @override
  State<FullDisplayScreen> createState() => _FullDisplayScreenState();
}

class _FullDisplayScreenState extends State<FullDisplayScreen> {
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
    // Stop engine when leaving
    Provider.of<PrayerProvider>(context, listen: false).stopEngine();
    super.dispose();
  }

  Future<void> _loadConfig() async {
    try {
      final mosqueId = await StorageService.getMosqueId();
      if (mosqueId == null) {
        if (mounted) {
          setState(() {
            _error = 'No mosque linked. Please re-pair this screen.';
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

      // Start prayer engine
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

  @override
  Widget build(BuildContext context) {
    if (_error != null) {
      return Scaffold(
        backgroundColor: AppColors.background,
        body: Center(
          child: Text(
            _error!,
            style: const TextStyle(
              color: AppColors.danger,
              fontSize: 20,
              fontFamily: AppFontFamily.inter,
            ),
            textAlign: TextAlign.center,
          ),
        ),
      );
    }

    if (_loading || _config == null) {
      return const Scaffold(
        backgroundColor: AppColors.background,
        body: Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
      );
    }

    return Scaffold(
      backgroundColor: Colors.white,
      body: Consumer<PrayerProvider>(
        builder: (context, prayer, _) {
          return Stack(
            children: [
              // Arabesque pattern overlay
              Positioned.fill(
                child: Opacity(
                  opacity: _config!.arabesqueOpacity ?? 0.05,
                  child: Image.network(
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuC51TgieKu6GyK9K1DTB21-J0ZsSqHDkIeOkebmvnOSphOufWQG-p75CzCzbNv42S2954DewNiHGu8xr0fFNirgscuZgoQjyH5lfXTw4EPkj5G54-b3ki0Y42SK2kszzPSXdxSPaxImmgSUud0s0SopMudy8kR7mImym5eOx3Kkc45oQZCpvcluxguLwJahU6wRu1niF6AR6hfwSmViCOQ1QRy9CgT9o6565AEgzNzOMPCNQJ31syhOPPnwzd8FZ6JJpSrFxliuEh7w',
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => const SizedBox.shrink(),
                  ),
                ),
              ),

              // Custom background if provided
              if (_config!.backgroundUrl != null)
                Positioned.fill(
                  child: Image.network(
                    _config!.backgroundUrl!,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => const SizedBox.shrink(),
                  ),
                ),

              // Main content
              Column(
                children: [
                  // Top Bar
                  TVTopBar(
                    now: prayer.now,
                    mosqueName: _config!.name,
                    mosqueAddress: _config!.address ?? 'Bandung, Jawa Barat',
                    calculationMethod: _config!.calculationMethod,
                    hijriAdjustment: _config!.hijriAdjustment,
                  ),

                  // Media carousel area (fills center)
                  const Expanded(
                    child: Stack(
                      children: [
                        MediaCarousel(),
                      ],
                    ),
                  ),

                  // Bottom Bar
                  TVBottomBar(
                    prayers: prayer.prayers,
                    nextPrayer: prayer.nextPrayer,
                    currentPrayer: prayer.currentPrayer,
                  ),

                  // News Ticker
                  const NewsTicker(),
                ],
              ),

              // FAB to switch to side layout
              Positioned(
                top: 120,
                right: 20,
                child: _LayoutSwitchButton(
                  label: 'SIDE',
                  onPressed: () {
                    Navigator.of(context).pushReplacementNamed('/side-display');
                  },
                ),
              ),

              // Prayer overlays on top of everything
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
