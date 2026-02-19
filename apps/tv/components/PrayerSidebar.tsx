import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePrayerStore } from '../store/prayerStore';
import { Colors, FontSize, FontFamily } from '../constants/theme';
import type { PrayerEntry, PrayerName } from '../services/prayerService';

function pad(n: number) { return n.toString().padStart(2, '0'); }

function formatTime(date: Date): string {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatHijri(date: Date): string {
    try {
        return date.toLocaleDateString('id-ID-u-ca-islamic', {
            day: 'numeric', month: 'long', year: 'numeric',
        });
    } catch {
        return '';
    }
}

// ─── Digital Clock ────────────────────────────────────────────
function DigitalClock({ now }: { now: Date }) {
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const date = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const hijri = formatHijri(now);

    return (
        <View style={clock.container}>
            <Text style={clock.time}>{time}</Text>
            <Text style={clock.date}>{date}</Text>
            {!!hijri && <Text style={clock.hijri}>{hijri}</Text>}
        </View>
    );
}

// ─── Single Prayer Row ────────────────────────────────────────
function PrayerRow({
    entry,
    isNext,
    isActive,
}: {
    entry: PrayerEntry;
    isNext: boolean;
    isActive: boolean;
}) {
    const bg = isActive
        ? Colors.primary
        : isNext
            ? 'rgba(5,150,105,0.15)'
            : 'transparent';

    const borderColor = isNext ? Colors.primary : 'transparent';
    const textColor = isActive ? '#fff' : isNext ? Colors.primary : Colors.textPrimary;
    const subColor = isActive ? 'rgba(255,255,255,0.7)' : Colors.textSecondary;

    return (
        <View style={[row.container, { backgroundColor: bg, borderColor }]}>
            <View style={row.left}>
                <Text style={[row.name, { color: textColor }]}>{entry.label}</Text>
                <Text style={[row.nameAr, { color: subColor }]}>{entry.labelAr}</Text>
            </View>
            <Text style={[row.time, { color: textColor }]}>{formatTime(entry.time)}</Text>
        </View>
    );
}

// ─── Main Sidebar ─────────────────────────────────────────────
export default function PrayerSidebar() {
    const { prayers, nextPrayer, currentPrayer, displayState, now } = usePrayerStore();

    const activePrayerName: PrayerName | null =
        displayState === 'ADZAN' || displayState === 'IQOMAH' || displayState === 'PRAYER'
            ? currentPrayer
            : null;

    return (
        <View style={styles.sidebar}>
            {/* Clock */}
            <DigitalClock now={now} />

            {/* Divider */}
            <View style={styles.divider} />

            {/* Prayer list */}
            <View style={styles.prayerList}>
                {prayers.map((entry) => (
                    <PrayerRow
                        key={entry.name}
                        entry={entry}
                        isNext={entry.name === nextPrayer && !activePrayerName}
                        isActive={entry.name === activePrayerName}
                    />
                ))}
            </View>

            {/* Bottom brand */}
            <Text style={styles.brand}>🕌 Jadzan</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    sidebar: {
        width: '25%',
        backgroundColor: Colors.surface,
        borderRightWidth: 1,
        borderRightColor: Colors.border,
        paddingVertical: 20,
        paddingHorizontal: 12,
        gap: 12,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginHorizontal: 4,
    },
    prayerList: {
        flex: 1,
        gap: 4,
    },
    brand: {
        color: Colors.textSecondary,
        fontSize: 14,
        fontFamily: FontFamily.inter,
        textAlign: 'center',
    },
});

const clock = StyleSheet.create({
    container: { alignItems: 'center', gap: 4 },
    time: {
        color: Colors.textPrimary,
        fontSize: FontSize.h1,
        fontFamily: FontFamily.interBold,
        letterSpacing: 2,
    },
    date: {
        color: Colors.textSecondary,
        fontSize: 13,
        fontFamily: FontFamily.inter,
        textAlign: 'center',
    },
    hijri: {
        color: Colors.accent,
        fontSize: 12,
        fontFamily: FontFamily.amiri,
        textAlign: 'center',
    },
});

const row = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
    },
    left: { gap: 1 },
    name: { fontSize: 15, fontFamily: FontFamily.interMedium },
    nameAr: { fontSize: 12, fontFamily: FontFamily.amiri },
    time: { fontSize: 16, fontFamily: FontFamily.interBold },
});
