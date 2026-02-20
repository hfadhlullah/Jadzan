import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Platform, Image, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { usePrayerStore } from '../store/prayerStore';
import { Colors, FontSize, FontFamily } from '../constants/theme';

function pad(n: number) { return n.toString().padStart(2, '0'); }

function formatCountdown(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${pad(m)}:${pad(s)}`;
}


// ─── Approaching Warning ──────────────────────────────────────
function ApproachingOverlay({
    prayerLabel,
    countdown,
}: {
    prayerLabel: string;
    countdown: number;
}) {
    const pulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const anim = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1.04, duration: 700, useNativeDriver: Platform.OS !== 'web' }),
                Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: Platform.OS !== 'web' }),
            ])
        );
        anim.start();
        return () => anim.stop();
    }, [pulse]);

    return (
        <View style={approaching.banner}>
            <Animated.View style={{ transform: [{ scale: pulse }] }}>
                <Text style={approaching.emoji}>🔔</Text>
            </Animated.View>
            <Text style={approaching.text}>
                Menuju {prayerLabel}{' '}
                <Text style={{ color: Colors.accent }}>{formatCountdown(countdown)}</Text>
            </Text>
        </View>
    );
}

// ─── Adzan Full-Screen ────────────────────────────────────────
function AdzanOverlay({ prayerLabel, prayerLabelAr }: { prayerLabel: string; prayerLabelAr: string }) {
    const pulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const anim = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1.05, duration: 1000, useNativeDriver: Platform.OS !== 'web' }),
                Animated.timing(pulse, { toValue: 1, duration: 1000, useNativeDriver: Platform.OS !== 'web' }),
            ])
        );
        anim.start();
        return () => anim.stop();
    }, [pulse]);

    return (
        <View style={adzan.container}>
            <Text style={adzan.title}>Adzan</Text>

            <Animated.View style={{ transform: [{ scale: pulse }], alignItems: 'center', paddingHorizontal: 40, width: '100%' }}>
                <Text style={adzan.prayer} adjustsFontSizeToFit numberOfLines={1}>{prayerLabel}</Text>
                <Text style={adzan.prayerAr} adjustsFontSizeToFit numberOfLines={1}>{prayerLabelAr}</Text>
            </Animated.View>

            <Text style={adzan.sub} adjustsFontSizeToFit numberOfLines={1}>Waktu shalat telah tiba</Text>
        </View>
    );
}

// ─── Iqomah Countdown ────────────────────────────────────────
// ─── Sound Resources ──────────────────────────────────────────
// Using short, reliable beep sounds
const BEEP_URI = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';
const FINAL_URI = 'https://actions.google.com/sounds/v1/alarms/mechanical_clock_ring.ogg';

// ─── Iqomah Countdown ────────────────────────────────────────
function IqomahOverlay({
    countdown,
    prayerLabel,
}: {
    countdown: number;
    prayerLabel: string;
}) {
    const isUrgent = countdown <= 60;
    const color = countdown > 300 ? Colors.primary : countdown > 60 ? Colors.accent : Colors.danger;

    const beepSound = useRef<Audio.Sound | null>(null);
    const finalSound = useRef<Audio.Sound | null>(null);
    const lastPlayed = useRef<number | null>(null);

    // Initialize sounds
    useEffect(() => {
        async function loadSounds() {
            try {
                const { sound: beep } = await Audio.Sound.createAsync({ uri: BEEP_URI });
                beepSound.current = beep;

                const { sound: final } = await Audio.Sound.createAsync({ uri: FINAL_URI });
                finalSound.current = final;
            } catch (error) {
                console.warn("Failed to load sounds", error);
            }
        }

        loadSounds();

        return () => {
            beepSound.current?.unloadAsync();
            finalSound.current?.unloadAsync();
        };
    }, []);

    // Play sounds logic
    useEffect(() => {
        const play = async (sound: Audio.Sound | null) => {
            if (!sound || lastPlayed.current === countdown) return;
            try {
                lastPlayed.current = countdown;
                await sound.replayAsync();
            } catch (err: any) {
                // Ignore errors
                console.warn("Audio play error", err);
            }
        };

        if (countdown > 0 && countdown <= 5) {
            play(beepSound.current);
        } else if (countdown === 0) {
            play(finalSound.current);
        }
    }, [countdown]);

    return (
        <View style={iqomah.container}>
            <Text style={iqomah.label} adjustsFontSizeToFit numberOfLines={1}>Iqomah {prayerLabel}</Text>
            <View style={{ width: '100%', paddingHorizontal: 40 }}>
                <Text style={[iqomah.timer, { color }]} adjustsFontSizeToFit numberOfLines={1}>
                    {formatCountdown(countdown)}
                </Text>
            </View>
            <Text style={iqomah.sub} adjustsFontSizeToFit numberOfLines={1}>
                {isUrgent ? '⚠ Harap segera berwudhu' : 'Bersiap untuk shalat'}
            </Text>
        </View>
    );
}

// ─── Prayer / Silence ────────────────────────────────────────
function PrayerOverlay({ prayerLabel }: { prayerLabel: string }) {
    return (
        <View style={prayer.container}>
            <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC51TgieKu6GyK9K1DTB21-J0ZsSqHDkIeOkebmvnOSphOufWQG-p75CzCzbNv42S2954DewNiHGu8xr0fFNirgscuZgoQjyH5lfXTw4EPkj5G54-b3ki0Y42SK2kszzPSXdxSPaxImmgSUud0s0SopMudy8kR7mImym5eOx3Kkc45oQZCpvcluxguLwJahU6wRu1niF6AR6hfwSmViCOQ1QRy9CgT9o6565AEgzNzOMPCNQJ31syhOPPnwzd8FZ6JJpSrFxliuEh7w' }}
                style={prayer.pattern}
                resizeMode="repeat"
            />
            <View style={{ width: '100%', paddingHorizontal: 40, alignItems: 'center' }}>
                <Text style={prayer.arabic} adjustsFontSizeToFit numberOfLines={1}>استووا واعتدلوا</Text>
                <Text style={prayer.title} adjustsFontSizeToFit numberOfLines={1}>SHOLAT SEDANG BERLANGSUNG</Text>
                <Text style={prayer.sub} adjustsFontSizeToFit numberOfLines={1}>{prayerLabel} · Harap tenang & matikan ponsel</Text>
            </View>
        </View>
    );
}

// ─── Main Export ─────────────────────────────────────────────
export default function PrayerOverlays() {
    const { displayState, currentPrayer, nextPrayer, countdown, prayers } = usePrayerStore();

    const activeName = currentPrayer ?? nextPrayer;
    const activeEntry = prayers.find((p) => p.name === activeName);
    const prayerLabel = activeEntry?.label ?? '';
    const prayerLabelAr = activeEntry?.labelAr ?? '';

    if (displayState === 'APPROACHING') {
        return <ApproachingOverlay prayerLabel={prayerLabel} countdown={countdown} />;
    }
    if (displayState === 'ADZAN') {
        return <AdzanOverlay prayerLabel={prayerLabel} prayerLabelAr={prayerLabelAr} />;
    }
    if (displayState === 'IQOMAH') {
        return <IqomahOverlay countdown={countdown} prayerLabel={prayerLabel} />;
    }
    if (displayState === 'PRAYER') {
        return <PrayerOverlay prayerLabel={prayerLabel} />;
    }
    return null;
}

// ── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
    audioHint: {
        position: 'absolute',
        bottom: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    audioHintText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: FontFamily.montserratSemiBold,
    },
});

const approaching = StyleSheet.create({
    banner: {
        position: 'absolute',
        top: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(217,119,6,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(217,119,6,0.2)',
        borderRadius: 30, // Pill shaped
        paddingHorizontal: 16,
        paddingVertical: 6,
        zIndex: 100,
    },
    emoji: { fontSize: 16 },
    text: {
        color: '#1E293B',
        fontSize: 14,
        fontFamily: FontFamily.montserratSemiBold,
    },
});

const adzan = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#020617',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 60,
        zIndex: 200,
    },
    title: {
        color: Colors.accent,
        fontSize: 24,
        fontFamily: FontFamily.montserratBold,
        textTransform: 'uppercase',
        letterSpacing: 10,
    },
    prayer: {
        color: '#FFFFFF',
        fontSize: 120,
        fontFamily: FontFamily.amiriBold,
        textAlign: 'center',
        lineHeight: 140,
    },
    prayerAr: {
        color: Colors.accent,
        fontSize: 80,
        fontFamily: FontFamily.amiri,
        marginTop: 10,
    },
    sub: {
        color: '#94A3B8',
        fontSize: 32,
        fontFamily: FontFamily.montserratSemiBold,
    },
});

const iqomah = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#020617',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        zIndex: 200,
    },
    label: {
        color: '#94A3B8',
        fontSize: 32,
        fontFamily: FontFamily.montserratBold,
        textTransform: 'uppercase',
        letterSpacing: 4,
    },
    timer: {
        fontSize: 180,
        fontFamily: FontFamily.montserratBold,
        letterSpacing: 8,
        lineHeight: 200,
        textAlign: 'center',
    },
    sub: {
        color: '#94A3B8',
        fontSize: 32,
        fontFamily: FontFamily.montserratSemiBold,
    },
});

const prayer = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#020617',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 60,
        zIndex: 200,
    },
    pattern: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1,
        tintColor: Colors.primary,
    },
    arabic: {
        color: Colors.primary,
        fontSize: 60,
        fontFamily: FontFamily.amiri,
        marginBottom: 10,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 50,
        fontFamily: FontFamily.montserratBold,
        textTransform: 'uppercase',
        textAlign: 'center',
        letterSpacing: 6,
        marginBottom: 8,
    },
    sub: {
        color: '#94A3B8',
        fontSize: 32,
        fontFamily: FontFamily.montserratSemiBold,
    },
});
