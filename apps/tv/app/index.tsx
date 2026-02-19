import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/theme';

/**
 * Empty index component. 
 * Redirection logic is handled in _layout.tsx based on device state.
 */
export default function Index() {
    return (
        <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
    );
}
