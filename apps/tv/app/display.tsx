import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../services/supabaseClient';
import { storageService } from '../services/storageService';
import { usePrayerStore } from '../store/prayerStore';
import PrayerSidebar from '../components/PrayerSidebar';
import PrayerOverlays from '../components/PrayerOverlays';
import MediaCarousel from '../components/MediaCarousel';
import NewsTicker from '../components/NewsTicker';
import { Colors, FontFamily } from '../constants/theme';
import type { IqomahDelays } from '../services/prayerService';

interface MosqueConfig {
    latitude: number;
    longitude: number;
    calculation_method: string;
    iqomah_delays: IqomahDelays;
    name: string;
}

export default function DisplayScreen() {
    const [config, setConfig] = useState<MosqueConfig | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { startEngine, stopEngine, displayState } = usePrayerStore();

    // Load mosque config from Supabase by screen's mosque_id
    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const mosqueId = await storageService.getMosqueId();
                if (!mosqueId) { setError('No mosque linked. Please re-pair this screen.'); return; }

                const { data, error: dbErr } = await supabase
                    .from('mosques')
                    .select('latitude,longitude,calculation_method,iqomah_delays,name')
                    .eq('id', mosqueId)
                    .single();

                if (dbErr || !data) { setError(dbErr?.message ?? 'Failed to load config.'); return; }
                if (!cancelled) setConfig(data as MosqueConfig);
            } catch (e) {
                if (!cancelled) setError(String(e));
            }
        })();

        return () => { cancelled = true; };
    }, []);

    // Start prayer engine once config is loaded
    useEffect(() => {
        if (!config) return;
        startEngine({
            lat: config.latitude,
            lng: config.longitude,
            method: config.calculation_method,
            iqomahDelays: config.iqomah_delays as IqomahDelays,
        });
        return () => stopEngine();
    }, [config, startEngine, stopEngine]);

    // During prayer — dim the media stage
    const stageDimmed =
        displayState === 'ADZAN' ||
        displayState === 'IQOMAH' ||
        displayState === 'PRAYER';

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!config) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading mosque configuration…</Text>
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <StatusBar hidden />

            {/* Zone A — Prayer Sidebar (25%) */}
            <PrayerSidebar />

            {/* Zone B + C — Right side (75%) */}
            <View style={[styles.stage, stageDimmed && styles.stageDimmed]}>

                {/* Zone B — Media Carousel (JADZ-024) */}
                <MediaCarousel />

                {/* Zone C — News Ticker (JADZ-029) */}
                <NewsTicker />
            </View>

            {/* Prayer overlays rendered on top of everything */}
            <PrayerOverlays />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.background,
    },
    center: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    errorText: {
        color: Colors.danger,
        fontSize: 20,
        fontFamily: FontFamily.inter,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    loadingText: {
        color: Colors.textSecondary,
        fontSize: 18,
        fontFamily: FontFamily.inter,
    },
    stage: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'flex-end',
        opacity: 1,
    },
    stageDimmed: {
        opacity: 0.15,
    },
    mediaPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    mosqueName: {
        color: Colors.textPrimary,
        fontSize: 36,
        fontFamily: FontFamily.interBold,
        opacity: 0.4,
    },
    placeholderSub: {
        color: Colors.textSecondary,
        fontSize: 16,
        fontFamily: FontFamily.inter,
        opacity: 0.4,
    },
    ticker: {
        height: 60,
        backgroundColor: Colors.surface,
        borderTopWidth: 1,
        borderTopColor: Colors.accent,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    tickerText: {
        color: Colors.textPrimary,
        fontSize: 20,
        fontFamily: FontFamily.inter,
    },
});
