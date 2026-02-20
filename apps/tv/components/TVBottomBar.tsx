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
                                <Text style={[styles.prayerLabel, isNext && styles.activeLabel]} adjustsFontSizeToFit numberOfLines={1}>
                                    {prayer.label}
                                </Text>
                                <Text style={[styles.prayerTime, isNext && styles.activeTime]} adjustsFontSizeToFit numberOfLines={1}>
                                    {formatTime(prayer.time)}
                                </Text>
                                {isNext && (
                                    <Text style={styles.countdownText} adjustsFontSizeToFit numberOfLines={1}>
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
        height: 120, // Match the slimmer height of the web app
        backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly more opaque white
        flexDirection: 'row',
        borderRadius: 30, // Softer radius to match web
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        alignItems: 'center',
        boxShadow: '0px -5px 15px rgba(0, 0, 0, 0.05)', // Softer shadow
        elevation: 10,
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
        width: 1,
        flex: 1,
        backgroundColor: '#D97706',
        opacity: 0.3, // Match web faintness
    },
    separatorOrnament: {
        fontSize: 10, // Match small diamond
        color: '#D97706',
        opacity: 0.5,
        lineHeight: 16,
        textAlign: 'center',
        width: 24,
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
        backgroundColor: '#F59E0B', // Web warning yellow color
        flex: 1.05, // Subtle pop, not massive
        boxShadow: '0px 0px 15px rgba(245, 158, 11, 0.4)',
        elevation: 15,
    },
    prayerLabel: {
        fontSize: 16, // Match web small size
        fontFamily: FontFamily.montserratSemiBold,
        color: '#64748B', // Muted slate color for labels
    },
    activeLabel: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: FontFamily.montserratSemiBold,
    },
    prayerTime: {
        fontSize: 32, // Match web clock size
        fontFamily: FontFamily.montserratBold,
        fontWeight: 'bold',
        color: '#1E293B', // Slate 800
        marginTop: 4,
    },
    activeTime: {
        fontSize: 36,
        fontFamily: FontFamily.montserratBold,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 4,
    },
    countdownText: {
        fontSize: 12,
        fontFamily: FontFamily.montserratMedium,
        color: '#FFFFFF',
        opacity: 0.9,
        marginTop: 4,
    },
});
