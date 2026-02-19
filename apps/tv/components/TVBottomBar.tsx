import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily } from '../constants/theme';
import type { PrayerEntry, PrayerName } from '../services/prayerService';

interface TVBottomBarProps {
    prayers: PrayerEntry[];
    nextPrayer: PrayerName | null;
    currentPrayer: PrayerName | null;
}

const IslamicSeparator = () => (
    <View style={styles.separatorContainer}>
        {/* Top Line */}
        <View style={styles.separatorLine} />
        {/* Central Ornament */}
        <Text style={styles.separatorOrnament}>❖</Text>
        {/* Bottom Line */}
        <View style={styles.separatorLine} />
    </View>
);

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
                        <React.Fragment key={prayer.name}>
                            <View
                                style={[
                                    styles.prayerBox,
                                    isNext && styles.activePrayerBox,
                                    (isFirst && isNext) && styles.firstBoxNext,
                                    (isLast && isNext) && styles.lastBoxNext,
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

                            {/* Render separator if not the last item and neither this nor the next item is highlighted */}
                            {!isLast && !isNext && !(prayers[index + 1].name === nextPrayer) && (
                                <IslamicSeparator />
                            )}
                        </React.Fragment>
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
        height: 200, // Increased from 160 to fit larger fonts + countdown
        backgroundColor: 'rgba(255, 255, 255, 0.85)', // Glass white
        flexDirection: 'row',
        borderRadius: 40,
        overflow: 'hidden',
        borderWidth: 1, // Add border for glass effect
        borderColor: 'rgba(255, 255, 255, 0.5)',
        alignItems: 'center', // Center items vertically
        // Shadow for footer
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 15,
    },
    separatorContainer: {
        width: 1, // Minimize width impact
        height: '80%', // Increased height
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        gap: 0, // No gap
        overflow: 'visible', // Allow ornament to overflow
    },
    separatorLine: {
        width: 1.5, // Thicker
        flex: 1,
        backgroundColor: '#D97706', // Solid Gold
        opacity: 0.4,
    },
    separatorOrnament: {
        fontSize: 16, // Larger
        color: '#D97706', // Gold/Amber
        opacity: 0.8, // More visible
        lineHeight: 16,
        textAlign: 'center',
        width: 24, // Enough width for character
        // Removed 'left' hack
    },
    prayerBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        height: '100%',
    },
    withBorder: {
        // Removed
    },
    firstBox: {
        // Removed as borderRadius is on container
    },
    lastBox: {
        // Removed
    },
    // Styles for when active item is first/last to ensure corners are filled if needed,
    // though container overflow:hidden handles most cases.
    firstBoxNext: {
        // specific styles if needed
    },
    lastBoxNext: {
        // specific styles if needed
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
        fontSize: 32, // Reference size
        fontFamily: FontFamily.montserratBold,
        color: '#1A233A', // Dark text
    },
    activeLabel: {
        color: '#FFFFFF',
        fontSize: 36, // Even bigger for active
        fontFamily: FontFamily.montserratBold,
    },
    prayerTime: {
        fontSize: 80, // Reference size
        fontFamily: FontFamily.montserratBold,
        color: '#1A233A', // Dark text
        marginTop: 4,
    },
    activeTime: {
        fontSize: 80, // Reference size
        fontFamily: FontFamily.montserratBold,
        color: '#FFFFFF',
        marginTop: -4,
    },
    countdownText: {
        fontSize: 20,
        fontFamily: FontFamily.montserratBold,
        color: '#FFFFFF',
        marginTop: 4,
    },
});
