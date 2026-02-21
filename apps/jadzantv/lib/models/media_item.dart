/// Media item from Supabase media_content table.
/// Mirrors MediaItem interface from the React Native version.

enum MediaType { image, video }

class MediaItem {
  final String id;
  final String title;
  final MediaType type;
  final String url;
  final int? duration; // seconds

  const MediaItem({
    required this.id,
    required this.title,
    required this.type,
    required this.url,
    this.duration,
  });

  factory MediaItem.fromJson(Map<String, dynamic> json) {
    return MediaItem(
      id: json['id'] as String,
      title: json['title'] as String? ?? '',
      type: (json['type'] as String?)?.toUpperCase() == 'VIDEO'
          ? MediaType.video
          : MediaType.image,
      url: json['url'] as String,
      duration: (json['duration'] as num?)?.toInt(),
    );
  }
}
