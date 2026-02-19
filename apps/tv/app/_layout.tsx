import { Slot } from 'expo-router';

/**
 * Root Layout (JADZ-018: Emergency Stability Revert)
 * We are using a pure Slot to bypass Hook dispatcher issues on Web with React 19.
 * This will temporarily disable the slide animation but should allow the app to boot.
 */
export default function RootLayout() {
    return <Slot />;
}
