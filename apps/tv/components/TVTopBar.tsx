import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { FontFamily } from '../constants/theme';

interface TVTopBarProps {
    now: Date;
    mosqueName: string;
    mosqueAddress: string;
    calculationMethod?: string;
    hijriAdjustment?: number;
}

const IslamicSeparator = () => (
    <View style={styles.separatorContainer}>
        {/* Top Line */}
        <View style={styles.separatorLine} />
        {/* Central Ornament */}
        <Text style={styles.separatorOrnament}>◆</Text>
        {/* Bottom Line */}
        <View style={styles.separatorLine} />
    </View>
);

export default function TVTopBar({ now, mosqueName, mosqueAddress, calculationMethod, hijriAdjustment = 0 }: TVTopBarProps) {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const gregorianDate = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Calculate Hijri date with combined adjustments
    // Base: KEMENAG (-1 day heuristic)
    // Manual: hijriAdjustment (user override from admin)
    const baseOffset = calculationMethod === 'KEMENAG' ? -1 : 0;
    const totalOffset = baseOffset + (hijriAdjustment || 0);

    const hijriDateObj = new Date(now);
    hijriDateObj.setDate(hijriDateObj.getDate() + totalOffset);

    const hijriDate = hijriDateObj.toLocaleDateString('id-ID-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <View style={styles.container}>
            <View style={styles.glassHeader}>
                {/* Clock */}
                <View style={styles.clockSection}>
                    <Text style={styles.timeText}>{timeStr}</Text>
                </View>

                <IslamicSeparator />

                {/* Mosque Info */}
                <View style={styles.mosqueSection}>
                    <View style={styles.mosqueHeader}>
                        <Text style={styles.mosqueName}>{mosqueName}</Text>
                    </View>
                    <Text style={styles.mosqueAddress}>{mosqueAddress}</Text>
                </View>

                <IslamicSeparator />

                {/* Dates */}
                <View style={styles.dateSection}>
                    <Text style={styles.gregorianText}>{gregorianDate}</Text>
                    <Text style={styles.hijriText}>{hijriDate}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        zIndex: 10,
    },
    glassHeader: {
        width: '95%',
        height: 200, // Increased to fit 130px clock
        backgroundColor: 'rgba(255, 255, 255, 0.85)', // Glass white
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 40, // Reduced padding
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        borderWidth: 1, // Add border for glass effect
        borderColor: 'rgba(255, 255, 255, 0.5)',
        boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1)',
        elevation: 10,
    },
    separatorContainer: {
        width: 40,
        height: '60%', // Match content height
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    separatorLine: {
        width: 1,
        flex: 1,
        backgroundColor: 'rgba(217, 119, 6, 0.3)', // Faint gold line
    },
    separatorOrnament: {
        fontSize: 14,
        color: '#D97706', // Gold/Amber
        opacity: 0.6,
        lineHeight: 14, // Tight line height for alignment
    },
    clockSection: {
        paddingRight: 20, // Reduced padding
        height: '60%',
        justifyContent: 'center',
    },
    timeText: {
        fontSize: 130, // Reference size
        fontFamily: FontFamily.montserratBold,
        color: '#1A233A', // prayer-navy
        letterSpacing: 0, // Increased spacing
    },
    mosqueSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 48,
    },
    mosqueHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    mosqueIcon: {
        width: 48,
        height: 48,
    },
    mosqueName: {
        fontSize: 48, // Reference size
        fontFamily: FontFamily.montserratBold,
        color: '#1A233A',
    },
    mosqueAddress: {
        fontSize: 24, // Reference size
        fontFamily: FontFamily.montserratSemiBold, // Bolder
        color: '#1A233A',
        opacity: 0.8,
        marginTop: 4,
    },
    dateSection: {
        paddingLeft: 20, // Reduced padding
        alignItems: 'flex-end',
        height: '60%',
        justifyContent: 'center',
    },
    hijriText: {
        fontSize: 28, // Secondary in reference
        fontFamily: FontFamily.montserratSemiBold,
        color: '#1A233A',
        marginTop: 4,
    },
    gregorianText: {
        fontSize: 36, // Primary in reference
        fontFamily: FontFamily.montserratBold, // Bolder
        color: '#1A233A',
    },
});
