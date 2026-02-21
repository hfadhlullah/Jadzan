import 'dart:async';
import 'package:flutter/material.dart';
import '../constants/app_theme.dart';
import '../services/supabase_client.dart';
import '../services/storage_service.dart';

/// Scrolling news ticker bar.
/// Mirrors components/NewsTicker.tsx from the React Native version.
class NewsTicker extends StatefulWidget {
  const NewsTicker({super.key});

  @override
  State<NewsTicker> createState() => _NewsTickerState();
}

class _NewsTickerState extends State<NewsTicker>
    with SingleTickerProviderStateMixin {
  List<String> _announcements = [];
  Timer? _refreshTimer;
  late AnimationController _animController;
  double _containerWidth = 0;
  double _textWidth = 0;
  final GlobalKey _textKey = GlobalKey();

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(vsync: this);
    _fetchAnnouncements();
    // Refresh every 5 minutes
    _refreshTimer = Timer.periodic(
      const Duration(minutes: 5),
      (_) => _fetchAnnouncements(),
    );
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    _animController.dispose();
    super.dispose();
  }

  Future<void> _fetchAnnouncements() async {
    final mosqueId = await StorageService.getMosqueId();
    if (mosqueId == null) return;

    try {
      final data = await SupabaseConfig.client
          .from('announcements')
          .select('text')
          .eq('mosque_id', mosqueId)
          .eq('is_active', true)
          .order('created_at', ascending: false);

      if (!mounted) return;
      setState(() {
        _announcements = (data as List).map((a) => a['text'] as String).toList();
      });
      // Restart animation after text changes
      WidgetsBinding.instance.addPostFrameCallback((_) => _startScrolling());
    } catch (e) {
      debugPrint('[NewsTicker] fetch error: $e');
    }
  }

  String get _fullText {
    if (_announcements.isEmpty) {
      return '\u{1F4E2} Welcome to our mosque. Please keep the prayer hall quiet.';
    }
    return _announcements.join('   \u00B7   ');
  }

  void _startScrolling() {
    if (!mounted) return;
    // Measure text width
    final textRO = _textKey.currentContext?.findRenderObject();
    if (textRO is RenderBox) {
      _textWidth = textRO.size.width;
    }
    if (_textWidth <= 0 || _containerWidth <= 0) return;

    final totalDistance = _textWidth + _containerWidth;
    final durationMs = (totalDistance * 15).toInt(); // Speed: 15ms per pixel (matches RN)

    _animController
      ..duration = Duration(milliseconds: durationMs)
      ..reset()
      ..forward().then((_) {
        if (mounted) _startScrolling(); // Loop
      });
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        _containerWidth = constraints.maxWidth;

        return Container(
          height: AppLayout.tickerHeight,
          color: const Color(0xFF0F172A), // Navy background
          clipBehavior: Clip.hardEdge,
          decoration: const BoxDecoration(),
          child: Stack(
            children: [
              AnimatedBuilder(
                animation: _animController,
                builder: (context, child) {
                  // Scroll from right edge to past left edge
                  final dx = _containerWidth -
                      (_containerWidth + _textWidth) * _animController.value;
                  return Positioned(
                    left: dx,
                    top: 0,
                    bottom: 0,
                    child: Center(child: child),
                  );
                },
                child: Text(
                  _fullText,
                  key: _textKey,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14, // Smaller for 40px height
                    fontFamily: AppFontFamily.montserrat,
                  ),
                  maxLines: 1,
                  softWrap: false,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

/// Custom AnimatedBuilder (AnimatedWidget wrapper).
class AnimatedBuilder extends AnimatedWidget {
  final Widget Function(BuildContext context, Widget? child) builder;
  final Widget? child;

  const AnimatedBuilder({
    super.key,
    required Animation<double> animation,
    required this.builder,
    this.child,
  }) : super(listenable: animation);

  @override
  Widget build(BuildContext context) {
    return builder(context, child);
  }
}
