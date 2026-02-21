import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';

import 'constants/app_theme.dart';
import 'services/supabase_client.dart';
import 'providers/device_provider.dart';
import 'providers/prayer_provider.dart';
import 'screens/pairing_screen.dart';
import 'screens/full_display_screen.dart';
import 'screens/side_display_screen.dart';
import 'screens/display_screen.dart';

/// Entry point for the Jadzan TV Flutter app.
/// Mirrors app/index.tsx + app/_layout.tsx from the React Native version.

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Force landscape orientation (Android TV)
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.landscapeLeft,
    DeviceOrientation.landscapeRight,
  ]);

  // Hide system UI (status bar, nav bar)
  await SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);

  // Load environment variables
  await dotenv.load(fileName: '.env');

  // Initialize Supabase
  await SupabaseConfig.initialize();

  runApp(const JadzanApp());
}

class JadzanApp extends StatelessWidget {
  const JadzanApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => DeviceProvider()),
        ChangeNotifierProvider(create: (_) => PrayerProvider()),
      ],
      child: MaterialApp(
        title: 'Jadzan TV',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          scaffoldBackgroundColor: AppColors.background,
          fontFamily: AppFontFamily.inter,
          colorScheme: ColorScheme.dark(
            primary: AppColors.primary,
            surface: AppColors.surface,
          ),
        ),
        home: const _InitScreen(),
        routes: {
          '/pairing': (_) => const PairingScreen(),
          '/full-display': (_) => const FullDisplayScreen(),
          '/side-display': (_) => const SideDisplayScreen(),
          '/display': (_) => const DisplayScreen(),
        },
      ),
    );
  }
}

/// Initial loading screen that checks device state and routes accordingly.
/// Mirrors app/index.tsx from the React Native version.
class _InitScreen extends StatefulWidget {
  const _InitScreen();

  @override
  State<_InitScreen> createState() => _InitScreenState();
}

class _InitScreenState extends State<_InitScreen> {
  bool _fontError = false;

  @override
  void initState() {
    super.initState();
    _initialize();
  }

  Future<void> _initialize() async {
    try {
      // Load device state from storage
      final deviceProvider =
          Provider.of<DeviceProvider>(context, listen: false);
      await deviceProvider.loadFromStorage();

      // Small delay to ensure layout is ready (matches RN setTimeout 100ms)
      await Future.delayed(const Duration(milliseconds: 100));

      if (!mounted) return;

      if (deviceProvider.isConfigured) {
        Navigator.of(context).pushReplacementNamed('/full-display');
      } else {
        Navigator.of(context).pushReplacementNamed('/pairing');
      }
    } catch (e) {
      debugPrint('[main] init error: $e');
      setState(() => _fontError = true);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_fontError) {
      return const Scaffold(
        backgroundColor: AppColors.background,
        body: Center(
          child: Text(
            'Initialization Error',
            style: TextStyle(color: AppColors.danger),
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            CircularProgressIndicator(color: AppColors.primary),
            SizedBox(height: 20),
            Text(
              'Initializing Jadzan...',
              style: TextStyle(
                color: Color(0xFF64748B),
                fontSize: 18,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
