import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors, FontFamily } from '../constants/theme';

interface TVTopBarProps {
    now: Date;
    mosqueName: string;
    mosqueAddress: string;
}

export default function TVTopBar({ now, mosqueName, mosqueAddress }: TVTopBarProps) {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const gregorianDate = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const hijriDate = now.toLocaleDateString('id-ID-u-ca-islamic', {
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

                {/* Mosque Info */}
                <View style={styles.mosqueSection}>
                    <View style={styles.mosqueHeader}>
                        <Image
                            source={{ uri: 'https://img.icons8.com/ios-filled/50/f39c12/mosque.png' }}
                            style={styles.mosqueIcon}
                        />
                        <Text style={styles.mosqueName}>{mosqueName}</Text>
                    </View>
                    <Text style={styles.mosqueAddress}>{mosqueAddress}</Text>
                </View>

                {/* Dates */}
                <View style={styles.dateSection}>
                    <Text style={styles.hijriText}>{hijriDate} H</Text>
                    <Text style={styles.gregorianText}>{gregorianDate}</Text>
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
        height: 140, // increased height for bigger fonts
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 60,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        // Shadow for "glass" effect depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
    },
    clockSection: {
        borderRightWidth: 1,
        borderColor: 'rgba(243, 156, 18, 0.3)', // Orange 400ish
        paddingRight: 48,
        height: '60%',
        justifyContent: 'center',
    },
    timeText: {
        fontSize: 96, // Increased from 72
        fontFamily: FontFamily.montserratBold,
        color: '#1A233A', // prayer-navy
        letterSpacing: -4,
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
        width: 32,
        height: 32,
    },
    mosqueName: {
        fontSize: 32, // Increased from 24
        fontFamily: FontFamily.montserratBold,
        color: '#1A233A',
    },
    mosqueAddress: {
        fontSize: 18, // Increased from 14
        fontFamily: FontFamily.montserratSemiBold, // Bolder
        color: '#1A233A',
        opacity: 0.8,
        marginTop: 4,
    },
    dateSection: {
        borderLeftWidth: 1,
        borderColor: 'rgba(243, 156, 18, 0.3)',
        paddingLeft: 48,
        alignItems: 'flex-end',
        height: '60%',
        justifyContent: 'center',
    },
    hijriText: {
        fontSize: 32, // Increased from 24
        fontFamily: FontFamily.montserratBold,
        color: '#1A233A',
    },
    gregorianText: {
        fontSize: 18, // Increased from 14
        fontFamily: FontFamily.montserratSemiBold, // Bolder
        color: '#1A233A',
        opacity: 0.8,
        marginTop: 4,
    },
});
