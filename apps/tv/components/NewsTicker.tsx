import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { supabase } from '../services/supabaseClient';
import { storageService } from '../services/storageService';
import { Colors, FontFamily, Layout } from '../constants/theme';

export default function NewsTicker() {
    const [announcements, setAnnouncements] = useState<string[]>([]);
    const scrollX = useRef(new Animated.Value(0)).current;
    const containerWidth = useRef(0);
    const textWidth = useRef(0);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const mosqueId = await storageService.getMosqueId();
            if (!mosqueId) return;

            const { data, error } = await supabase
                .from('announcements')
                .select('text')
                .eq('mosque_id', mosqueId)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (!cancelled && !error && data) {
                setAnnouncements(data.map(a => a.text));
            }
        })();

        // Refresh every 5 minutes
        const timer = setInterval(async () => {
            const mosqueId = await storageService.getMosqueId();
            if (!mosqueId || cancelled) return;
            const { data } = await supabase
                .from('announcements')
                .select('text')
                .eq('mosque_id', mosqueId)
                .eq('is_active', true);
            if (!cancelled && data) {
                setAnnouncements(data.map(a => a.text));
            }
        }, 5 * 60 * 1000);

        return () => { cancelled = true; clearInterval(timer); };
    }, []);

    const fullText = announcements.join('   ·   ') || '📢 Welcome to our mosque. Please keep the prayer hall quiet.';

    useEffect(() => {
        let isMoving = true;

        const startAnimation = () => {
            if (!textWidth.current || !containerWidth.current || !isMoving) return;

            scrollX.setValue(containerWidth.current);
            Animated.timing(scrollX, {
                toValue: -textWidth.current,
                duration: (textWidth.current + containerWidth.current) * 15,
                easing: Easing.linear,
                useNativeDriver: Platform.OS !== 'web',
            }).start(({ finished }) => {
                if (finished && isMoving) {
                    // Use requestAnimationFrame to break the recursion stack
                    requestAnimationFrame(startAnimation);
                }
            });
        };

        // Delay start slightly to ensure layout is settled
        const initialTimeout = setTimeout(startAnimation, 100);

        return () => {
            isMoving = false;
            clearTimeout(initialTimeout);
            scrollX.stopAnimation();
        };
    }, [fullText, scrollX]);

    return (
        <View
            style={styles.container}
            onLayout={(e) => { containerWidth.current = e.nativeEvent.layout.width; }}
        >
            <Animated.Text
                style={[
                    styles.text,
                    { transform: [{ translateX: scrollX }] }
                ]}
                onLayout={(e) => { textWidth.current = e.nativeEvent.layout.width; }}
            >
                {fullText}
            </Animated.Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: Layout.tickerHeight,
        backgroundColor: '#0F172A', // Navy background
        justifyContent: 'center',
        overflow: 'hidden',
    },
    text: {
        position: 'absolute',
        color: '#FFFFFF',
        fontSize: 14, // Smaller for 40px height
        fontFamily: FontFamily.montserrat,
    },
});
