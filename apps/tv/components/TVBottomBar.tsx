import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily } from '../constants/theme';
import type { PrayerEntry, PrayerName } from '../services/prayerService';

interface TVBottomBarProps {
    prayers: PrayerEntry[];
    nextPrayer: PrayerName | null;
    currentPrayer: PrayerName | null;
}

export default function TVBottomBar({ prayers, nextPrayer, currentPrayer }: TVBottomBarProps) {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formatTime = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

    const renderCountdown = (prayerTime: Date) => {
        const diff = prayerTime.getTime() - Date.now();
        if (diff <= 0) return null;

        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        return `-${pad(h)}:${pad(m)}:${pad(s)}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.glassFooter}>
                {prayers.map((prayer, index) => {
                    const isNext = prayer.name === nextPrayer;
                    const isFirst = index === 0;
                    const isLast = index === prayers.length - 1;

                    return (
                        <View
                            key={prayer.name}
                            style={[
                                styles.prayerBox,
                                isNext && styles.activePrayerBox,
                                isFirst && styles.firstBox,
                                isLast && styles.lastBox,
                                (!isLast && !isNext && !(prayers[index + 1].name === nextPrayer)) && styles.withBorder
                            ]}
                        >
                            <Text style={[styles.prayerLabel, isNext && styles.activeLabel]}>
                                {prayer.label}
                            </Text>
                            <Text style={[styles.prayerTime, isNext && styles.activeTime]}>
                                {formatTime(prayer.time)}
                            </Text>
                            {isNext && (
                                <Text style={styles.countdownText}>
                                    {renderCountdown(prayer.time)}
                                </Text>
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 32,
    },
    glassFooter: {
        width: '95%',
        height: 160,
        backgroundColor: '#FFFFFF', // White background
        flexDirection: 'row',
        borderRadius: 40,
        overflow: 'hidden',
        // Shadow for footer
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 15,
    },
    prayerBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
    },
    withBorder: {
        borderRightWidth: 1,
        borderRightColor: 'rgba(26, 35, 58, 0.1)', // Subtle dark border
    },
    firstBox: {
        borderTopLeftRadius: 40,
        borderBottomLeftRadius: 40,
    },
    lastBox: {
        borderTopRightRadius: 40,
        borderBottomRightRadius: 40,
    },
    activePrayerBox: {
        backgroundColor: '#f39c12',
        flex: 1.2,
        shadowColor: '#f39c12',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 20,
    },
    prayerLabel: {
        fontSize: 24, // Increased
        fontFamily: FontFamily.montserratBold,
        color: '#1A233A', // Dark text
    },
    activeLabel: {
        color: '#FFFFFF',
        fontSize: 28, // Even bigger for active
        fontFamily: FontFamily.montserratBold,
    },
    prayerTime: {
        fontSize: 66, // Increased from 44
        fontFamily: FontFamily.montserratBold,
        color: '#1A233A', // Dark text
        marginTop: 4,
    },
    activeTime: {
        fontSize: 64, // Increased from 56
        fontFamily: FontFamily.montserratBold,
        color: '#FFFFFF',
        marginTop: -4,
    },
    countdownText: {
        fontSize: 18,
        fontFamily: FontFamily.montserratBold,
        color: '#FFFFFF',
        marginTop: 4,
    },
});
