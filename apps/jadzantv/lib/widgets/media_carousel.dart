import 'dart:async';
import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import '../constants/app_theme.dart';
import '../models/media_item.dart';
import '../services/supabase_client.dart';
import '../services/storage_service.dart';

/// Default slide duration (ms) for images without an explicit duration.
const int _defaultImageDurationMs = 10000;

/// Media carousel widget.
/// Mirrors components/MediaCarousel.tsx from the React Native version.
class MediaCarousel extends StatefulWidget {
  const MediaCarousel({super.key});

  @override
  State<MediaCarousel> createState() => _MediaCarouselState();
}

class _MediaCarouselState extends State<MediaCarousel> {
  List<MediaItem> _items = [];
  bool _loading = true;
  int _index = 0;
  double _opacity = 1.0;
  Timer? _refreshTimer;

  @override
  void initState() {
    super.initState();
    _fetchMedia();
    // Poll every 60s so admin changes propagate without reboot
    _refreshTimer = Timer.periodic(
      const Duration(seconds: 60),
      (_) => _fetchMedia(silent: true),
    );
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    super.dispose();
  }

  Future<void> _fetchMedia({bool silent = false}) async {
    final screenId = await StorageService.getScreenId();
    if (screenId == null) {
      if (!silent && mounted) setState(() => _loading = false);
      return;
    }

    try {
      final data = await SupabaseConfig.client
          .from('targeted_media')
          .select('media_content(id, title, type, url, duration)')
          .eq('screen_id', screenId);

      if (!mounted) return;
      final flat = (data as List)
          .map((row) => row['media_content'])
          .where((mc) => mc != null)
          .map<MediaItem>((mc) => MediaItem.fromJson(mc as Map<String, dynamic>))
          .toList();

      setState(() {
        _items = flat;
        _index = 0;
        _loading = false;
      });
    } catch (e) {
      debugPrint('[MediaCarousel] fetch error: $e');
      if (!silent && mounted) setState(() => _loading = false);
    }
  }

  void _advance() {
    if (_items.isEmpty) return;
    setState(() => _opacity = 0.0);
    Future.delayed(const Duration(milliseconds: 600), () {
      if (!mounted) return;
      setState(() {
        _index = (_index + 1) % _items.length;
        _opacity = 1.0;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(
        child: CircularProgressIndicator(color: AppColors.primary),
      );
    }

    if (_items.isEmpty) {
      return const SizedBox.shrink(); // Don't show anything if no media
    }

    final current = _items[_index % _items.length];

    return Container(
      color: AppColors.background,
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Slide with fade
          AnimatedOpacity(
            opacity: _opacity,
            duration: const Duration(milliseconds: 600),
            child: _MediaSlide(
              key: ValueKey(current.id),
              item: current,
              onEnd: _advance,
            ),
          ),

          // Title overlay at bottom
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              color: const Color(0xBF0F172A), // rgba(15,23,42,0.75)
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      current.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 18,
                        fontFamily: AppFontFamily.inter,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  // Dot indicators
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: List.generate(_items.length, (i) {
                      final isActive = i == _index % _items.length;
                      return Container(
                        margin: EdgeInsets.only(left: i == 0 ? 0 : 6),
                        width: isActive ? 18 : 6,
                        height: 6,
                        decoration: BoxDecoration(
                          color: isActive
                              ? AppColors.primary
                              : AppColors.textSecondary,
                          borderRadius: BorderRadius.circular(
                            isActive ? 9 : 3,
                          ),
                        ),
                      );
                    }),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Renders one media slide (image or video).
class _MediaSlide extends StatelessWidget {
  final MediaItem item;
  final VoidCallback onEnd;

  const _MediaSlide({
    super.key,
    required this.item,
    required this.onEnd,
  });

  @override
  Widget build(BuildContext context) {
    if (item.type == MediaType.image) {
      return _ImageSlide(item: item, onEnd: onEnd);
    }
    return _VideoSlide(item: item, onEnd: onEnd);
  }
}

/// Image slide with auto-advance timer.
class _ImageSlide extends StatefulWidget {
  final MediaItem item;
  final VoidCallback onEnd;

  const _ImageSlide({required this.item, required this.onEnd});

  @override
  State<_ImageSlide> createState() => _ImageSlideState();
}

class _ImageSlideState extends State<_ImageSlide> {
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    final ms = widget.item.duration != null
        ? widget.item.duration! * 1000
        : _defaultImageDurationMs;
    _timer = Timer(Duration(milliseconds: ms), widget.onEnd);
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Image.network(
      widget.item.url,
      fit: BoxFit.cover,
      width: double.infinity,
      height: double.infinity,
      errorBuilder: (_, __, ___) => const Center(
        child: Icon(Icons.broken_image, color: AppColors.textSecondary, size: 48),
      ),
    );
  }
}

/// Video slide that advances on completion.
class _VideoSlide extends StatefulWidget {
  final MediaItem item;
  final VoidCallback onEnd;

  const _VideoSlide({required this.item, required this.onEnd});

  @override
  State<_VideoSlide> createState() => _VideoSlideState();
}

class _VideoSlideState extends State<_VideoSlide> {
  late VideoPlayerController _controller;
  bool _ended = false;

  @override
  void initState() {
    super.initState();
    _controller = VideoPlayerController.networkUrl(Uri.parse(widget.item.url))
      ..setLooping(false)
      ..initialize().then((_) {
        if (mounted) {
          setState(() {});
          _controller.play();
        }
      });
    _controller.addListener(_onPlayerUpdate);
  }

  void _onPlayerUpdate() {
    if (_ended) return;
    final pos = _controller.value.position;
    final dur = _controller.value.duration;
    if (dur.inMilliseconds > 0 && pos >= dur) {
      _ended = true;
      widget.onEnd();
    }
  }

  @override
  void dispose() {
    _controller.removeListener(_onPlayerUpdate);
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!_controller.value.isInitialized) {
      return const Center(
        child: CircularProgressIndicator(color: AppColors.primary),
      );
    }
    return FittedBox(
      fit: BoxFit.cover,
      child: SizedBox(
        width: _controller.value.size.width,
        height: _controller.value.size.height,
        child: VideoPlayer(_controller),
      ),
    );
  }
}
