import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontFamily } from '../constants/theme';

interface SideTopBarProps {
    now: Date;
    mosqueName: string;
    mosqueAddress: string;
    hijriAdjustment?: number;
    calculationMethod?: string;
}

const IslamicSeparator = () => (
    <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorOrnament}>◆</Text>
        <View style={styles.separatorLine} />
    </View>
);

export default function SideTopBar({ now, mosqueName, mosqueAddress, hijriAdjustment = 0, calculationMethod }: SideTopBarProps) {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    // Date Formatting: "Kamis, 01 Februari"
    const gregorianDate = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
    });

    // Hijri Calculation
    const baseOffset = calculationMethod === 'KEMENAG' ? -1 : 0;
    const totalOffset = baseOffset + (hijriAdjustment || 0);
    const hijriDateObj = new Date(now);
    hijriDateObj.setDate(hijriDateObj.getDate() + totalOffset);

    // Hijri Formatting: "20 Rajab 1445"
    const hijriDate = hijriDateObj.toLocaleDateString('id-ID-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <View style={styles.container}>
            {/* Left: Clock */}
            <View style={styles.clockSection}>
                <Text style={styles.timeText} adjustsFontSizeToFit numberOfLines={1}>{timeStr}</Text>
            </View>

            {/* Divider */}
            <IslamicSeparator />

            {/* Center: Mosque Info */}
            <View style={styles.centerSection}>
                <Text style={styles.mosqueName} adjustsFontSizeToFit numberOfLines={1}>{mosqueName}</Text>
                <Text style={styles.mosqueAddress} adjustsFontSizeToFit numberOfLines={1}>{mosqueAddress}</Text>
            </View>

            {/* Divider */}
            <IslamicSeparator />

            {/* Right: Date */}
            <View style={styles.dateSection}>
                <Text style={styles.datePrimary} adjustsFontSizeToFit numberOfLines={1}>{gregorianDate}</Text>
                <Text style={styles.dateSecondary} adjustsFontSizeToFit numberOfLines={1}>{hijriDate}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 80, // Slimmer height
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    separatorContainer: {
        width: 60,
        height: '60%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        marginHorizontal: 10,
    },
    separatorLine: {
        width: 1.5,
        flex: 1,
        backgroundColor: 'rgba(217, 119, 6, 0.3)',
    },
    separatorOrnament: {
        fontSize: 14,
        color: '#D97706',
        opacity: 0.6,
        lineHeight: 14,
    },
    clockSection: {
        justifyContent: 'center',
    },
    timeText: {
        fontSize: 48, // Much smaller
        fontFamily: FontFamily.montserratBold,
        fontWeight: 'bold',
        color: '#1E293B',
        includeFontPadding: false,
    },
    centerSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mosqueName: {
        fontSize: 24, // Smaller
        fontFamily: FontFamily.montserratBold,
        fontWeight: 'bold',
        color: '#0F172A',
        textAlign: 'center',
    },
    mosqueAddress: {
        fontSize: 14, // Smaller
        fontFamily: FontFamily.montserratMedium,
        color: '#64748B',
        textAlign: 'center',
    },
    dateSection: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: 280,
    },
    datePrimary: {
        fontSize: 20, // Smaller
        fontFamily: FontFamily.montserratBold,
        fontWeight: 'bold',
        color: '#1E293B',
        textAlign: 'right',
    },
    dateSecondary: {
        fontSize: 16, // Smaller
        fontFamily: FontFamily.montserratMedium,
        color: '#64748B',
        textAlign: 'right',
    },
});
