import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
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
                Animated.timing(pulse, { toValue: 1.04, duration: 700, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
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
                {prayerLabel} in{' '}
                <Text style={{ color: Colors.accent }}>{formatCountdown(countdown)}</Text>
            </Text>
        </View>
    );
}

// ─── Adzan Full-Screen ────────────────────────────────────────
function AdzanOverlay({ prayerLabel, prayerLabelAr }: { prayerLabel: string; prayerLabelAr: string }) {
    const glow = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const anim = Animated.loop(
            Animated.sequence([
                Animated.timing(glow, { toValue: 1, duration: 1200, useNativeDriver: false }),
                Animated.timing(glow, { toValue: 0, duration: 1200, useNativeDriver: false }),
            ])
        );
        anim.start();
        return () => anim.stop();
    }, [glow]);

    const borderColor = glow.interpolate({
        inputRange: [0, 1],
        outputRange: [Colors.primary, Colors.accent],
    });

    return (
        <View style={adzan.container}>
            <Animated.View style={[adzan.card, { borderColor }]}>
                <Text style={adzan.arabic}>اَلسَّلَامُ عَلَيْكُمْ</Text>
                <Text style={adzan.title}>Adzan</Text>
                <Text style={adzan.prayer}>{prayerLabel}</Text>
                <Text style={adzan.prayerAr}>{prayerLabelAr}</Text>
                <Text style={adzan.sub}>Prayer time has begun</Text>
            </Animated.View>
        </View>
    );
}

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

    return (
        <View style={iqomah.container}>
            <Text style={iqomah.label}>Iqomah for {prayerLabel}</Text>
            <Text style={[iqomah.timer, { color }]}>
                {formatCountdown(countdown)}
            </Text>
            <Text style={iqomah.sub}>
                {isUrgent ? '⚠ Please complete your wudu' : 'Prepare for prayer'}
            </Text>
        </View>
    );
}

// ─── Prayer / Silence ────────────────────────────────────────
function PrayerOverlay({ prayerLabel }: { prayerLabel: string }) {
    return (
        <View style={prayer.container}>
            <Text style={prayer.emoji}>🤲</Text>
            <Text style={prayer.title}>Prayer Time</Text>
            <Text style={prayer.sub}>{prayerLabel} · Silence please</Text>
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

const approaching = StyleSheet.create({
    banner: {
        position: 'absolute',
        top: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(217,119,6,0.15)',
        borderWidth: 1,
        borderColor: Colors.accent,
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 10,
        zIndex: 100,
    },
    emoji: { fontSize: 24 },
    text: {
        color: Colors.textPrimary,
        fontSize: 20,
        fontFamily: FontFamily.interMedium,
    },
});

const adzan = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15,23,42,0.95)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
    },
    card: {
        alignItems: 'center',
        gap: 16,
        borderWidth: 2,
        borderRadius: 24,
        paddingHorizontal: 80,
        paddingVertical: 60,
        backgroundColor: Colors.surface,
    },
    arabic: {
        color: Colors.accent,
        fontSize: 36,
        fontFamily: FontFamily.amiriBold,
    },
    title: {
        color: Colors.textSecondary,
        fontSize: 24,
        fontFamily: FontFamily.inter,
        textTransform: 'uppercase',
        letterSpacing: 6,
    },
    prayer: {
        color: Colors.textPrimary,
        fontSize: FontSize.h1,
        fontFamily: FontFamily.interBold,
    },
    prayerAr: {
        color: Colors.textSecondary,
        fontSize: 36,
        fontFamily: FontFamily.amiriBold,
    },
    sub: {
        color: Colors.textSecondary,
        fontSize: 20,
        fontFamily: FontFamily.inter,
    },
});

const iqomah = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15,23,42,0.92)',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        zIndex: 200,
    },
    label: {
        color: Colors.textSecondary,
        fontSize: 24,
        fontFamily: FontFamily.inter,
    },
    timer: {
        fontSize: FontSize.displayXL,
        fontFamily: FontFamily.interBold,
        letterSpacing: 8,
    },
    sub: {
        color: Colors.textSecondary,
        fontSize: 20,
        fontFamily: FontFamily.inter,
    },
});

const prayer = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(5,150,105,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        zIndex: 200,
    },
    emoji: { fontSize: 64 },
    title: {
        color: Colors.primary,
        fontSize: FontSize.h1,
        fontFamily: FontFamily.interBold,
    },
    sub: {
        color: Colors.textSecondary,
        fontSize: 24,
        fontFamily: FontFamily.inter,
    },
});
