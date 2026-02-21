import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../constants/app_theme.dart';
import '../models/prayer_entry.dart';
import '../models/mosque_config.dart';
import '../services/supabase_client.dart';
import '../services/storage_service.dart';
import '../providers/prayer_provider.dart';
import '../widgets/prayer_sidebar.dart';
import '../widgets/prayer_overlays.dart';
import '../widgets/media_carousel.dart';
import '../widgets/news_ticker.dart';

/// Legacy display screen (25/75 split).
/// Mirrors app/display.tsx from the React Native version.
class DisplayScreen extends StatefulWidget {
  const DisplayScreen({super.key});

  @override
  State<DisplayScreen> createState() => _DisplayScreenState();
}

class _DisplayScreenState extends State<DisplayScreen> {
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
            _error = 'No mosque linked. Please re-pair this screen.';
            _loading = false;
          });
        }
        return;
      }

      final data = await SupabaseConfig.client
          .from('mosques')
          .select(
              'latitude,longitude,calculation_method,iqomah_delays,name,address,background_url,arabesque_opacity,hijri_adjustment')
          .eq('id', mosqueId)
          .single();

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
      return Scaffold(
        backgroundColor: AppColors.background,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              CircularProgressIndicator(color: AppColors.primary),
              SizedBox(height: 16),
              Text(
                'Loading mosque configuration\u2026',
                style: TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 18,
                  fontFamily: AppFontFamily.inter,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Consumer<PrayerProvider>(
        builder: (context, prayer, _) {
          final stageDimmed = prayer.displayState == DisplayState.adzan ||
              prayer.displayState == DisplayState.iqomah ||
              prayer.displayState == DisplayState.prayer;

          return Stack(
            children: [
              Row(
                children: [
                  // Zone A — Prayer Sidebar (25%)
                  const PrayerSidebar(),

                  // Zone B + C — Right side (75%)
                  Expanded(
                    child: Opacity(
                      opacity: stageDimmed ? 0.15 : 1.0,
                      child: const Column(
                        children: [
                          // Zone B — Media Carousel
                          Expanded(child: MediaCarousel()),
                          // Zone C — News Ticker
                          NewsTicker(),
                        ],
                      ),
                    ),
                  ),
                ],
              ),

              // Prayer overlays rendered on top of everything
              const PrayerOverlays(),
            ],
          );
        },
      ),
    );
  }
}
