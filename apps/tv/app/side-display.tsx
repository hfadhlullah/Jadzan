import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { supabase } from '../services/supabaseClient';
import { storageService } from '../services/storageService';
import { usePrayerStore } from '../store/prayerStore';
import { Colors, FontFamily } from '../constants/theme';
import type { IqomahDelays } from '../services/prayerService';

import SideTopBar from '../components/SideTopBar';
import SidePrayerList from '../components/SidePrayerList';
import MediaCarousel from '../components/MediaCarousel';
import NewsTicker from '../components/NewsTicker';
// import { Ionicons } from '@expo/vector-icons'; // Not installed

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

export default function SideDisplayScreen() {
    const router = useRouter();
    const [config, setConfig] = useState<MosqueConfig | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { startEngine, stopEngine, prayers, nextPrayer, currentPrayer, displayState, now, countdown } = usePrayerStore();

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const mosqueId = await storageService.getMosqueId();
                if (!mosqueId) { setError('No mosque linked.'); return; }

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

    if (error) return <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>;
    if (!config) return <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>;

    return (
        <View style={styles.root}>
            <StatusBar hidden />

            {/* Top Bar */}
            <SideTopBar
                now={now}
                mosqueName={config.name}
                mosqueAddress={config.address || ''}
                calculationMethod={config.calculation_method}
                hijriAdjustment={config.hijri_adjustment}
            />

            {/* Main Body */}
            <View style={styles.body}>
                {/* Left Sidebar: Prayer List */}
                <View style={styles.sidebar}>
                    <SidePrayerList
                        prayers={prayers}
                        nextPrayer={nextPrayer}
                        currentPrayer={currentPrayer}
                        displayState={displayState}
                        now={now}
                    />
                </View>

                {/* Right Content: Media Area */}
                <View style={styles.contentArea}>
                    {/* Media Carousel acts as background for this area */}
                    <MediaCarousel />

                    <Image
                        source={{ uri: config.background_url || 'https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=2070' }}
                        style={[StyleSheet.absoluteFill, { zIndex: -2 }]}
                        resizeMode="cover"
                    />

                    {/* Status Pill Overlays */}
                    <View style={styles.statusPills}>
                        <View style={styles.statusPill}>
                            <Text style={styles.statusPillText}>
                                {(() => {
                                    const next = prayers.find(p => p.name === nextPrayer);
                                    if (!next) return '';
                                    const pad = (n: number) => n.toString().padStart(2, '0');
                                    const hh = Math.floor(countdown / 3600);
                                    const mm = Math.floor((countdown % 3600) / 60);
                                    const ss = countdown % 60;
                                    return `${next.label} -${pad(hh)}:${pad(mm)}:${pad(ss)}`;
                                })()}
                            </Text>
                        </View>
                    </View>

                    {/* Switch Button Overlay */}
                    <TouchableOpacity
                        style={styles.fab}
                        onPress={() => router.push('/full-display')}
                    >
                        <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>FULL</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Footer Ticker */}
            <NewsTicker />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
    },
    errorText: {
        color: Colors.danger,
        fontSize: 20,
    },
    body: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebar: {
        width: '22%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRightWidth: 1,
        borderRightColor: '#E2E8F0',
    },
    contentArea: {
        flex: 1, // Takes remaining 70%
        position: 'relative',
        backgroundColor: '#0F172A', // Dark background for media
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
    },
    statusPills: {
        position: 'absolute',
        bottom: 40,
        left: 40,
        flexDirection: 'row',
        gap: 20,
    },
    statusPill: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 40,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        elevation: 10,
    },
    statusPillText: {
        fontSize: 32,
        fontFamily: FontFamily.montserratBold,
        color: '#1E293B',
    },
});
