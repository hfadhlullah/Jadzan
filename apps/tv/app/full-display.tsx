import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { supabase } from '../services/supabaseClient';
import { storageService } from '../services/storageService';
import { usePrayerStore } from '../store/prayerStore';
import { Colors, FontFamily } from '../constants/theme';
import type { IqomahDelays } from '../services/prayerService';

import TVTopBar from '../components/TVTopBar';
import TVBottomBar from '../components/TVBottomBar';
// import TVBadges from '../components/TVBadges';
import NewsTicker from '../components/NewsTicker';
import MediaCarousel from '../components/MediaCarousel';
import PrayerOverlays from '../components/PrayerOverlays';

interface MosqueConfig {
    latitude: number;
    longitude: number;
    calculation_method: string;
    iqomah_delays: IqomahDelays;
    name: string;
    address: string | null;
    background_url: string | null;
    arabesque_opacity: number | null;
    hijri_adjustment: number;
}

export default function FullDisplayScreen() {
    const router = useRouter();
    const [config, setConfig] = useState<MosqueConfig | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { startEngine, stopEngine, prayers, nextPrayer, currentPrayer, now } = usePrayerStore();

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const mosqueId = await storageService.getMosqueId();
                if (!mosqueId) { setError('No mosque linked. Please re-pair this screen.'); return; }

                const { data, error: dbErr } = await supabase
                    .from('mosques')
                    .select('latitude,longitude,calculation_method,iqomah_delays,name,address,background_url,arabesque_opacity,hijri_adjustment')
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
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <StatusBar hidden />

            {/* Arabesque Overlay */}
            <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC51TgieKu6GyK9K1DTB21-J0ZsSqHDkIeOkebmvnOSphOufWQG-p75CzCzbNv42S2954DewNiHGu8xr0fFNirgscuZgoQjyH5lfXTw4EPkj5G54-b3ki0Y42SK2kszzPSXdxSPaxImmgSUud0s0SopMudy8kR7mImym5eOx3Kkc45oQZCpvcluxguLwJahU6wRu1niF6AR6hfwSmViCOQ1QRy9CgT9o6565AEgzNzOMPCNQJ31syhOPPnwzd8FZ6JJpSrFxliuEh7w' }}
                style={[styles.arabesque, { opacity: config.arabesque_opacity ?? 0.05 }]}
                resizeMode="repeat"
            />

            {/* Custom Background if provided */}
            {config.background_url && (
                <Image
                    source={{ uri: config.background_url }}
                    style={StyleSheet.absoluteFill}
                    resizeMode="cover"
                />
            )}

            <View style={styles.mainContainer}>
                {/* Top Bar */}
                <TVTopBar
                    now={now}
                    mosqueName={config.name}
                    mosqueAddress={config.address || 'Bandung, Jawa Barat'}
                    calculationMethod={config.calculation_method}
                    hijriAdjustment={config.hijri_adjustment} // Pass manual adjustment
                />

                <MediaCarousel />

                {/* Main Content Area (Center) */}
                <View style={styles.mainContent}>
                    {/* Switch to Side Layout */}
                    <TouchableOpacity
                        style={styles.fab}
                        onPress={() => router.push('/side-display')}
                        accessible={true}
                        hasTVPreferredFocus={true}
                        activeOpacity={0.7}
                    >
                        <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>SIDE</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Bar */}
                <TVBottomBar
                    prayers={prayers}
                    nextPrayer={nextPrayer}
                    currentPrayer={currentPrayer}
                />

                <NewsTicker />
            </View>

            <PrayerOverlays />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    arabesque: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.05,
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    mainContent: {
        flex: 1,
        position: 'relative',
    },
    center: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: Colors.danger,
        fontSize: 20,
        fontFamily: FontFamily.inter,
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    }
});
