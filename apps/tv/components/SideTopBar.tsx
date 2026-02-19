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
                <Text style={styles.timeText}>{timeStr}</Text>
            </View>

            {/* Divider */}
            <IslamicSeparator />

            {/* Center: Mosque Info */}
            <View style={styles.centerSection}>
                <Text style={styles.mosqueName} numberOfLines={1}>{mosqueName}</Text>
                <Text style={styles.mosqueAddress} numberOfLines={1}>{mosqueAddress}</Text>
            </View>

            {/* Divider */}
            <IslamicSeparator />

            {/* Right: Date */}
            <View style={styles.dateSection}>
                <Text style={styles.datePrimary}>{gregorianDate}</Text>
                <Text style={styles.dateSecondary}>{hijriDate}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 120,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
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
        fontSize: 90,
        fontFamily: FontFamily.montserratBold,
        color: '#1E293B',
        includeFontPadding: false,
        lineHeight: 90,
    },
    centerSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mosqueName: {
        fontSize: 36,
        fontFamily: FontFamily.montserratBold,
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 4,
    },
    mosqueAddress: {
        fontSize: 18,
        fontFamily: FontFamily.montserratMedium,
        color: '#334155',
        textAlign: 'center',
    },
    dateSection: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: 280,
    },
    datePrimary: {
        fontSize: 26,
        fontFamily: FontFamily.montserratBold,
        color: '#1E293B',
        textAlign: 'right',
        marginBottom: 4,
    },
    dateSecondary: {
        fontSize: 20,
        fontFamily: FontFamily.montserratMedium,
        color: '#475569',
        textAlign: 'right',
    },
});
