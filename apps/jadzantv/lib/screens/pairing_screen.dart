import 'dart:async';
import 'package:flutter/material.dart';
import '../constants/app_theme.dart';
import '../services/supabase_client.dart';
import '../services/storage_service.dart';
import '../providers/device_provider.dart';
import 'package:provider/provider.dart';

/// Pairing screen — generates a 6-digit code, polls Supabase until paired.
/// Mirrors app/pairing.tsx from the React Native version.
class PairingScreen extends StatefulWidget {
  const PairingScreen({super.key});

  @override
  State<PairingScreen> createState() => _PairingScreenState();
}

enum _PairingState { generating, waiting, paired, error }

class _PairingScreenState extends State<PairingScreen> {
  _PairingState _state = _PairingState.generating;
  String? _pairingCode;
  String? _screenId;
  String? _errorMsg;
  Timer? _pollingTimer;

  @override
  void initState() {
    super.initState();
    _createPendingScreen();
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    super.dispose();
  }

  /// Generate a unique 6-digit code and insert a PENDING screen row.
  Future<void> _createPendingScreen() async {
    try {
      final code = (100000 + (DateTime.now().microsecond % 900000)).toString();

      final data = await SupabaseConfig.client
          .from('screens')
          .insert({'pairing_code': code, 'status': 'PENDING'})
          .select('id')
          .single();

      if (!mounted) return;
      setState(() {
        _pairingCode = code;
        _screenId = data['id'] as String;
        _state = _PairingState.waiting;
      });
      _startPolling();
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _errorMsg = e.toString();
        _state = _PairingState.error;
      });
    }
  }

  /// Poll Supabase every 3s until screen becomes ACTIVE.
  void _startPolling() {
    _pollingTimer = Timer.periodic(const Duration(seconds: 3), (_) async {
      if (_screenId == null) return;

      try {
        final data = await SupabaseConfig.client
            .from('screens')
            .select('id, status, mosque_id')
            .eq('id', _screenId!)
            .maybeSingle();

        if (data != null &&
            data['status'] == 'ACTIVE' &&
            data['mosque_id'] != null) {
          _pollingTimer?.cancel();

          // Persist to storage
          await StorageService.setScreenId(data['id'] as String);
          await StorageService.setMosqueId(data['mosque_id'] as String);

          if (!mounted) return;

          // Update provider
          final deviceProvider =
              Provider.of<DeviceProvider>(context, listen: false);
          await deviceProvider.setScreenId(data['id'] as String);
          deviceProvider.setMosqueId(data['mosque_id'] as String);

          setState(() => _state = _PairingState.paired);

          // Navigate to full-display after brief delay
          Future.delayed(const Duration(milliseconds: 500), () {
            if (mounted) {
              Navigator.of(context).pushReplacementNamed('/full-display');
            }
          });
        }
      } catch (e) {
        debugPrint('[PairingScreen] poll error: $e');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    // Render code as spaced digits: "123456" → "1 2 3 4 5 6"
    final displayCode = _pairingCode != null
        ? _pairingCode!.split('').join(' ')
        : '\u2013 \u2013 \u2013 \u2013 \u2013 \u2013';

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 60),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Brand
              const Text(
                '\u{1F54C} Jadzan',
                style: TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 40,
                  fontFamily: AppFontFamily.inter,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 24),
              const Text(
                'Activate This Screen',
                style: TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 22,
                  fontFamily: AppFontFamily.inter,
                ),
              ),
              const SizedBox(height: 24),

              // Code card
              Container(
                constraints: const BoxConstraints(minWidth: 480),
                padding:
                    const EdgeInsets.symmetric(horizontal: 60, vertical: 36),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.primary, width: 2),
                ),
                child: _buildCardContent(displayCode),
              ),

              // Instructions
              if (_state == _PairingState.waiting) ...[
                const SizedBox(height: 32),
                ...[
                  'Open the Admin Panel on your phone or computer',
                  'Go to Screens \u2192 Pair a New Screen',
                  'Enter the code above and give this screen a name',
                ].asMap().entries.map((e) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Text(
                      '${e.key + 1}. ${e.value}',
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 16,
                        fontFamily: AppFontFamily.inter,
                        height: 1.5,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  );
                }),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCardContent(String displayCode) {
    switch (_state) {
      case _PairingState.generating:
        return const Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        );
      case _PairingState.error:
        return Text(
          _errorMsg ?? 'Failed to generate code',
          style: const TextStyle(
            color: AppColors.danger,
            fontSize: 18,
            fontFamily: AppFontFamily.inter,
          ),
          textAlign: TextAlign.center,
        );
      case _PairingState.paired:
        return const Text(
          '\u2713 Paired!',
          style: TextStyle(
            color: AppColors.primary,
            fontSize: AppFontSize.display,
            fontFamily: AppFontFamily.inter,
            fontWeight: FontWeight.w700,
            letterSpacing: 10,
          ),
        );
      case _PairingState.waiting:
        return Column(
          children: [
            const Text(
              'Enter this code in your Admin Panel',
              style: TextStyle(
                color: AppColors.textSecondary,
                fontSize: 18,
                fontFamily: AppFontFamily.inter,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            Text(
              displayCode,
              style: const TextStyle(
                color: AppColors.primary,
                fontSize: AppFontSize.display,
                fontFamily: AppFontFamily.inter,
                fontWeight: FontWeight.w700,
                letterSpacing: 10,
              ),
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: AppColors.textSecondary,
                  ),
                ),
                SizedBox(width: 8),
                Text(
                  'Waiting for pairing\u2026',
                  style: TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 16,
                    fontFamily: AppFontFamily.inter,
                  ),
                ),
              ],
            ),
          ],
        );
    }
  }
}
