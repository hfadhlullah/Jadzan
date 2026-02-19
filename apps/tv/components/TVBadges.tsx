import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontFamily } from '../constants/theme';

export default function TVBadges() {
    return (
        <View style={styles.container}>
            {/* Center Area: Event Banner (Moved to top right area as per HTML) */}
            <View style={styles.eventBanner}>
                <Text style={styles.eventText}>Maulid Nabi Muhammad SAW - 90 Hari</Text>
            </View>

            {/* Mode Badge (keeping it as per previous implementation but styling it more like the header) */}
            <View style={styles.modeBadge}>
                <Text style={styles.modeText}>🔊 Mode Muadzin</Text>
            </View>

            {/* Right: Settings Button */}
            <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7}>
                <View style={styles.settingsIconContainer}>
                    <Text style={styles.settingsEmoji}>⚙️</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        pointerEvents: 'box-none',
    },
    eventBanner: {
        position: 'absolute',
        top: 150,
        right: 48,
        backgroundColor: '#e74c3c', // hex for tailwind red-600ish
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 9999,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    eventText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: FontFamily.interBold,
    },
    modeBadge: {
        position: 'absolute',
        top: 150,
        left: 48,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 9999,
    },
    modeText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: FontFamily.interMedium,
    },
    settingsButton: {
        position: 'absolute',
        right: 24,
        top: '50%',
        marginTop: -24,
    },
    settingsIconContainer: {
        width: 48,
        height: 48,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    settingsEmoji: {
        fontSize: 24,
    },
});
