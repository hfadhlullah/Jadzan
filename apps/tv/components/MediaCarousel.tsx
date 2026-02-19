import { useEffect, useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Animated,
    ActivityIndicator,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { supabase } from '../services/supabaseClient';
import { storageService } from '../services/storageService';
import { Colors, FontFamily } from '../constants/theme';

interface MediaItem {
    id: string;
    title: string;
    type: 'IMAGE' | 'VIDEO';
    url: string;
    duration: number | null;
}

// Default slide duration (ms) for images without an explicit duration
const DEFAULT_IMAGE_DURATION_MS = 10_000;

// ─────────────────────────────────────────────────────────────
// useMediaItems — fetch targeted media for this screen
// ─────────────────────────────────────────────────────────────

function useMediaItems() {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const screenId = await storageService.getScreenId();
            if (!screenId) { setLoading(false); return; }

            const { data, error } = await supabase
                .from('targeted_media')
                .select('media_content(id, title, type, url, duration)')
                .eq('screen_id', screenId);

            if (cancelled) return;
            if (!error && data) {
                const flat = (data
                    .map((row) => row.media_content)
                    .filter(Boolean) as unknown) as MediaItem[];
                setItems(flat);
            }
            setLoading(false);
        })();

        // Poll every 60s so admin changes propagate without reboot
        const refreshTimer = setInterval(async () => {
            const screenId = await storageService.getScreenId();
            if (!screenId || cancelled) return;
            const { data } = await supabase
                .from('targeted_media')
                .select('media_content(id, title, type, url, duration)')
                .eq('screen_id', screenId);
            if (!cancelled && data) {
                const flat = (data
                    .map((row) => row.media_content)
                    .filter(Boolean) as unknown) as MediaItem[];
                setItems(flat);
            }
        }, 60_000);

        return () => { cancelled = true; clearInterval(refreshTimer); };
    }, []);

    return { items, loading };
}

// ─────────────────────────────────────────────────────────────
// MediaSlide — renders one slide
// ─────────────────────────────────────────────────────────────

function MediaSlide({
    item,
    onEnd,
}: {
    item: MediaItem;
    onEnd: () => void;
}) {
    // Images: auto-advance after duration
    useEffect(() => {
        if (item.type !== 'IMAGE') return;
        const ms = item.duration ? item.duration * 1000 : DEFAULT_IMAGE_DURATION_MS;
        const timer = setTimeout(onEnd, ms);
        return () => clearTimeout(timer);
    }, [item, onEnd]);

    const player = useVideoPlayer(item.url, (p) => {
        p.loop = false;
        p.play();
    });

    useEffect(() => {
        const subscription = player.addListener('playToEnd', () => {
            onEnd();
        });
        return () => {
            subscription.remove();
        };
    }, [player, onEnd]);

    if (item.type === 'IMAGE') {
        return (
            <Image
                source={{ uri: item.url }}
                style={styles.media}
                resizeMode="cover"
            />
        );
    }

    return (
        <VideoView
            player={player}
            style={styles.media}
            contentFit="cover"
            allowsFullscreen={false}
            allowsPictureInPicture={false}
        />
    );
}

// ─────────────────────────────────────────────────────────────
// MediaCarousel — main component
// ─────────────────────────────────────────────────────────────

export default function MediaCarousel() {
    const { items, loading } = useMediaItems();
    const [index, setIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const advance = useCallback(() => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
        }).start(() => {
            setIndex((prev) => (prev + 1) % Math.max(items.length, 1));
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }).start();
        });
    }, [fadeAnim, items.length]);

    // Reset index when items reload
    useEffect(() => { setIndex(0); }, [items]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (items.length === 0) {
        return null; // Don't show anything if no media, let default background show
    }

    const current = items[index % items.length];

    return (
        <View style={styles.root}>
            <Animated.View style={[styles.slide, { opacity: fadeAnim }]}>
                <MediaSlide key={current.id} item={current} onEnd={advance} />

                {/* Title overlay at bottom */}
                <View style={styles.titleBar}>
                    <Text style={styles.titleText} numberOfLines={1}>
                        {current.title}
                    </Text>
                    {/* Dot indicators */}
                    <View style={styles.dots}>
                        {items.map((_, i) => (
                            <View
                                key={i}
                                style={[styles.dot, i === index % items.length && styles.dotActive]}
                            />
                        ))}
                    </View>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.background,
        zIndex: -1, // Behind other content
    },
    slide: {
        flex: 1,
    },
    media: {
        flex: 1,
        width: '100%',
    },
    titleBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'rgba(15,23,42,0.75)',
        gap: 12,
    },
    titleText: {
        flex: 1,
        color: Colors.textPrimary,
        fontSize: 18,
        fontFamily: FontFamily.interMedium,
    },
    dots: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.textSecondary,
    },
    dotActive: {
        backgroundColor: Colors.primary,
        width: 18,
        borderRadius: 9,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 48,
    },
    emptyLabel: {
        color: Colors.textSecondary,
        fontSize: 22,
        fontFamily: FontFamily.interMedium,
        textAlign: 'center',
        opacity: 0.6,
    },
    emptyHint: {
        color: Colors.textSecondary,
        fontSize: 16,
        fontFamily: FontFamily.inter,
        textAlign: 'center',
        opacity: 0.4,
    },
});
