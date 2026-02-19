import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabaseClient';
import { storageService } from '../services/storageService';
import { useDeviceStore } from '../store/deviceStore';
import { Colors, FontSize, FontFamily } from '../constants/theme';

type PairingState = 'generating' | 'waiting' | 'paired' | 'error';

/** Generate a unique 6-digit code and insert a PENDING screen row */
async function createPendingScreen(): Promise<{ code: string; screenId: string }> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const { data, error } = await supabase
        .from('screens')
        .insert({ pairing_code: code, status: 'PENDING' })
        .select('id')
        .single();

    if (error || !data) throw new Error(error?.message ?? 'Failed to create pairing code');
    return { code, screenId: data.id };
}

export default function PairingScreen() {
    const [state, setState] = useState<PairingState>('generating');
    const [pairingCode, setPairingCode] = useState<string | null>(null);
    const [screenId, setScreenId] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const { setScreenId: storeSetScreenId, setMosqueId } = useDeviceStore();
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Step 1: Generate pairing code on mount
    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const { code, screenId: id } = await createPendingScreen();
                if (cancelled) return;
                setPairingCode(code);
                setScreenId(id);
                setState('waiting');
            } catch (err) {
                if (!cancelled) {
                    setErrorMsg(String(err));
                    setState('error');
                }
            }
        })();

        return () => { cancelled = true; };
    }, []);

    // Step 2: Poll Supabase every 3s until screen becomes ACTIVE
    useEffect(() => {
        if (state !== 'waiting' || !screenId) return;

        pollingRef.current = setInterval(async () => {
            const { data } = await supabase
                .from('screens')
                .select('id, status, mosque_id')
                .eq('id', screenId)
                .maybeSingle();

            if (data?.status === 'ACTIVE' && data.mosque_id) {
                clearInterval(pollingRef.current!);
                setState('paired');
                // Persist to storage and Zustand
                await storageService.setScreenId(data.id);
                await storageService.setMosqueId(data.mosque_id);
                storeSetScreenId(data.id);
                setMosqueId(data.mosque_id);
            }
        }, 3000);

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [state, screenId, storeSetScreenId, setMosqueId]);

    // Render code as spaced digits: "123456" → "1 2 3 4 5 6"
    const displayCode = pairingCode ? pairingCode.split('').join(' ') : '– – – – – –';

    return (
        <View style={styles.container}>
            {/* Brand */}
            <Text style={styles.brand}>🕌 Jadzan</Text>
            <Text style={styles.subtitle}>Activate This Screen</Text>

            {/* Code card */}
            <View style={styles.card}>
                {state === 'generating' ? (
                    <ActivityIndicator size="large" color={Colors.primary} />
                ) : state === 'error' ? (
                    <Text style={styles.errorText}>{errorMsg ?? 'Failed to generate code'}</Text>
                ) : state === 'paired' ? (
                    <Text style={[styles.codeText, { color: Colors.primary }]}>✓ Paired!</Text>
                ) : (
                    <>
                        <Text style={styles.codeLabel}>Enter this code in your Admin Panel</Text>
                        <Text style={styles.codeText}>{displayCode}</Text>
                        <View style={styles.waitingRow}>
                            <ActivityIndicator size="small" color={Colors.textSecondary} />
                            <Text style={styles.waitingText}>Waiting for pairing…</Text>
                        </View>
                    </>
                )}
            </View>

            {/* Instructions */}
            {state === 'waiting' && (
                <View style={styles.steps}>
                    {[
                        'Open the Admin Panel on your phone or computer',
                        'Go to Screens → Pair a New Screen',
                        'Enter the code above and give this screen a name',
                    ].map((step, i) => (
                        <Text key={i} style={styles.stepText}>
                            {i + 1}. {step}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 60,
        gap: 24,
    },
    brand: {
        color: Colors.textPrimary,
        fontSize: 40,
        fontFamily: FontFamily.interBold,
    },
    subtitle: {
        color: Colors.textSecondary,
        fontSize: 22,
        fontFamily: FontFamily.inter,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: Colors.primary,
        paddingHorizontal: 60,
        paddingVertical: 36,
        alignItems: 'center',
        gap: 16,
        minWidth: 480,
    },
    codeLabel: {
        color: Colors.textSecondary,
        fontSize: 18,
        fontFamily: FontFamily.inter,
        textAlign: 'center',
    },
    codeText: {
        color: Colors.primary,
        fontSize: FontSize.display,
        fontFamily: FontFamily.interBold,
        letterSpacing: 10,
    },
    waitingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
    },
    waitingText: {
        color: Colors.textSecondary,
        fontSize: 16,
        fontFamily: FontFamily.inter,
    },
    errorText: {
        color: Colors.danger,
        fontSize: 18,
        fontFamily: FontFamily.inter,
        textAlign: 'center',
    },
    steps: {
        gap: 8,
        marginTop: 8,
        maxWidth: 500,
    },
    stepText: {
        color: Colors.textSecondary,
        fontSize: 16,
        fontFamily: FontFamily.inter,
        textAlign: 'center',
        lineHeight: 24,
    },
});
