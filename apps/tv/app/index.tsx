import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { Colors } from '../constants/theme';
import { FONTS } from '../constants/fonts';
import { useDeviceStore } from '../store/deviceStore';

/**
 * Entry Point Index.
 * Handles the initial routing and global asset loading.
 */
export default function Index() {
    const router = useRouter();
    const { isConfigured, isLoading, loadFromStorage } = useDeviceStore();
    const [fontsLoaded, fontError] = useFonts(FONTS);

    useEffect(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    useEffect(() => {
        if (!isLoading && fontsLoaded) {
            // Use setTimeout instead of requestAnimationFrame because headless/emulators 
            // might not tick frames while the splash screen or layout is still resolving.
            setTimeout(() => {
                if (isConfigured) {
                    router.replace('/full-display');
                } else {
                    router.replace('/pairing');
                }
            }, 100);
        }
    }, [isLoading, fontsLoaded, isConfigured, router]);

    if (fontError) {
        return (
            <View style={styles.center}>
                <Text style={{ color: Colors.danger }}>Font Loading Error</Text>
            </View>
        );
    }

    return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Initializing Jadzan...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        color: '#64748b',
        fontWeight: '500'
    }
});
