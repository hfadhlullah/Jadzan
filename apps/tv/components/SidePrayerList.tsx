import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontFamily } from '../constants/theme';
import type { PrayerEntry, PrayerName } from '../services/prayerService';

interface SidePrayerListProps {
    prayers: PrayerEntry[];
    nextPrayer: PrayerName | null;
    currentPrayer: PrayerName | null;
    displayState: string;
    now: Date;
}

const PRAYER_THEMES: Record<PrayerName, { bg: string; text: string }> = {
    imsak: { bg: '#10B981', text: '#FFFFFF' }, // Emerald 500
    fajr: { bg: '#3B82F6', text: '#FFFFFF' }, // Blue 500
    sunrise: { bg: '#0D9488', text: '#FFFFFF' }, // Teal 600
    dhuhr: { bg: '#F59E0B', text: '#FFFFFF' }, // Amber 500
    asr: { bg: '#9333EA', text: '#FFFFFF' }, // Purple 600
    maghrib: { bg: '#EA580C', text: '#FFFFFF' }, // Orange 600
    isha: { bg: '#1E3A8A', text: '#FFFFFF' }, // Blue 900
};

const IslamicSeparator = () => (
    <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorOrnament}>❖</Text>
        <View style={styles.separatorLine} />
    </View>
);

export default function SidePrayerList({ prayers, nextPrayer, currentPrayer, displayState, now }: SidePrayerListProps) {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatTime = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

    // Determine active prayer for highlighting
    const activePrayerName = (displayState === 'ADZAN' || displayState === 'IQOMAH' || displayState === 'PRAYER')
        ? currentPrayer
        : null;

    return (
        <View style={styles.container}>
            {prayers.map((entry, index) => {
                // Highlight if it's currently active (adzan/iqomah/prayer)
                // OR if it's the next upcoming prayer and nothing is active
                const isHighlight = entry.name === activePrayerName ||
                    (activePrayerName === null && entry.name === nextPrayer);
                const theme = PRAYER_THEMES[entry.name];

                const rowStyle = [
                    styles.row,
                    isHighlight && { backgroundColor: theme.bg, borderColor: theme.bg }
                ];

                const badgeStyle = [
                    styles.badge,
                    isHighlight ? { backgroundColor: 'transparent' } : { backgroundColor: theme.bg }
                ];

                const nameColor = '#FFFFFF';
                const timeColor = isHighlight ? '#FFFFFF' : '#0F172A';

                return (
                    <React.Fragment key={entry.name}>
                        <View style={rowStyle}>
                            {/* Name Badge */}
                            <View style={badgeStyle}>
                                <Text style={[styles.nameText, { color: nameColor }]}>
                                    {entry.label}
                                </Text>
                            </View>

                            {/* Time */}
                            <Text style={[styles.timeText, { color: timeColor }]}>
                                {formatTime(entry.time)}
                            </Text>
                        </View>

                        {/* Render separator if not the last item and neither this nor the next item is highlighted */}
                        {index < prayers.length - 1 && !isHighlight &&
                            !(prayers[index + 1].name === nextPrayer && activePrayerName === null) &&
                            !(prayers[index + 1].name === activePrayerName) && (
                                <IslamicSeparator />
                            )}
                    </React.Fragment>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 44,
        marginVertical: 0,
        backgroundColor: '#FFFFFF',
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 10,
        paddingHorizontal: 60,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(217, 119, 6, 0.2)',
    },
    separatorOrnament: {
        fontSize: 12,
        color: '#D97706',
        opacity: 0.5,
        marginHorizontal: 12,
    },
    badge: {
        paddingVertical: 24,
        paddingHorizontal: 44,
        borderRadius: 50,
        minWidth: 140,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nameText: {
        fontSize: 26,
        fontFamily: FontFamily.montserratBold,
        textTransform: 'capitalize',
        letterSpacing: 0.5,
    },
    timeText: {
        fontSize: 64,
        fontFamily: FontFamily.montserratBold,
        letterSpacing: -1,
    },
});
