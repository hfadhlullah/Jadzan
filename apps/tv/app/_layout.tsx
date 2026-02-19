import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { ErrorBoundary } from '../components/ErrorBoundary';

/**
 * Root Layout (JADZ-018: Navigation Animation Fix)
 * We use Platform.select to handle animations differently on Web vs Native.
 * On Native, we use 'slide_from_right'. 
 * On Web, 'fade' or 'default' often works better with the React Navigation stack.
 */
export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <ErrorBoundary>
                <StatusBar hidden />
                <Stack
                    screenOptions={{
                        headerShown: false,
                        // Enable animations cross-platform
                        animation: Platform.OS === 'web' ? 'fade' : 'slide_from_right',
                        animationDuration: 400,
                        // Ensure screen reconciles correctly during transitions
                        gestureEnabled: true,
                    }}
                >
                    <Stack.Screen name="index" options={{ animation: 'none' }} />
                    <Stack.Screen name="full-display" />
                    <Stack.Screen name="side-display" />
                    <Stack.Screen name="pairing" />
                </Stack>
            </ErrorBoundary>
        </SafeAreaProvider>
    );
}
