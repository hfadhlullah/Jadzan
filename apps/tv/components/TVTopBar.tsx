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
                    <Text style={styles.timeText} adjustsFontSizeToFit numberOfLines={1}>{timeStr}</Text>
                </View>

                <IslamicSeparator />

                {/* Mosque Info */}
                <View style={styles.mosqueSection}>
                    <View style={styles.mosqueHeader}>
                        <Text style={styles.mosqueName} adjustsFontSizeToFit numberOfLines={1}>{mosqueName}</Text>
                    </View>
                    <Text style={styles.mosqueAddress} adjustsFontSizeToFit numberOfLines={1}>{mosqueAddress}</Text>
                </View>

                <IslamicSeparator />

                {/* Dates */}
                <View style={styles.dateSection}>
                    <Text style={styles.gregorianText} adjustsFontSizeToFit numberOfLines={1}>{gregorianDate}</Text>
                    <Text style={styles.hijriText} adjustsFontSizeToFit numberOfLines={1}>{hijriDate}</Text>
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
        height: 100, // Match the slimmer height of the web app 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly more opaque white
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        borderBottomLeftRadius: 30, // Much softer
        borderBottomRightRadius: 30, // Much softer 
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.05)',
        elevation: 10,
    },
    separatorContainer: {
        width: 30,
        height: '50%', // Subtle lines
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
        fontSize: 10,
        color: '#D97706', // Gold/Amber
        opacity: 0.5,
        lineHeight: 14, // Tight line height for alignment
    },
    clockSection: {
        paddingRight: 20, // Reduced padding
        height: '100%',
        justifyContent: 'center',
    },
    timeText: {
        fontSize: 60, // Much smaller to match web
        fontFamily: FontFamily.montserratSemiBold,
        fontWeight: 'bold',
        color: '#1E293B', // prayer-navy
        letterSpacing: 0, // Increased spacing
    },
    mosqueSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    mosqueHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    mosqueIcon: {
        width: 32,
        height: 32,
    },
    mosqueName: {
        fontSize: 24, // Much smaller to match web
        fontFamily: FontFamily.montserratBold,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    mosqueAddress: {
        fontSize: 14, // Note address is much smaller
        fontFamily: FontFamily.montserratSemiBold,
        color: '#64748B', // Muted slate color
        marginTop: 2,
    },
    dateSection: {
        paddingLeft: 20,
        alignItems: 'flex-end',
        height: '100%',
        justifyContent: 'center',
    },
    gregorianText: {
        fontSize: 20, // Primary smaller
        fontFamily: FontFamily.montserratBold,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    hijriText: {
        fontSize: 16, // Secondary smaller
        fontFamily: FontFamily.montserratSemiBold,
        color: '#64748B',
        marginTop: 4,
    },
});
