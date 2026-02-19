import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { activateKeepAwakeAsync } from 'expo-keep-awake';
import { StatusBar } from 'expo-status-bar';
import { useRouter, Slot } from 'expo-router';
import { FONTS } from '../constants/fonts';
import { Colors } from '../constants/theme';
import { useDeviceStore } from '../store/deviceStore';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function RootLayout() {
    const router = useRouter();
    const { isConfigured, isLoading, loadFromStorage } = useDeviceStore();

    const [fontsLoaded, fontError] = useFonts(FONTS);

    // Keep Awake — kiosk mode (JADZ-006)
    useEffect(() => {
        activateKeepAwakeAsync();
    }, []);

    // Load persisted device state on boot
    useEffect(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    // Route to correct screen once loaded
    useEffect(() => {
        if (!isLoading && fontsLoaded) {
            if (isConfigured) {
                router.replace('/display');
            } else {
                router.replace('/pairing');
            }
        }
    }, [isLoading, fontsLoaded, isConfigured, router]);

    if (!fontsLoaded && !fontError) {
        return (
            <View style={styles.splash}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (fontError) {
        return (
            <View style={styles.splash}>
                <Text style={styles.errorText}>Failed to load fonts.</Text>
            </View>
        );
    }

    return (
        <ErrorBoundary>
            <StatusBar hidden />
            {fontsLoaded && !isLoading ? (
                <Slot />
            ) : (
                <View style={styles.splash}>
                    <Text style={styles.brandText}>🕌 Jadzan</Text>
                    <Text style={styles.subText}>Loading…</Text>
                </View>
            )}
        </ErrorBoundary>
    );
}

const styles = StyleSheet.create({
    splash: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    brandText: {
        color: Colors.textPrimary,
        fontSize: 36,
        fontFamily: 'Inter-Bold',
    },
    subText: {
        color: Colors.textSecondary,
        fontSize: 18,
        fontFamily: 'Inter',
    },
    errorText: {
        color: Colors.danger,
        fontSize: 16,
    },
});
