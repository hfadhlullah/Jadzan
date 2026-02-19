# JADZ-003: Init Expo TV App + Design Tokens

**Epic:** FOUNDATION - Project Scaffold
**Layer:** L2-ui-foundation
**Role:** Frontend
**Estimation:** 3 Points
**Priority:** Must

---

## Objective
Bootstrap the Expo (React Native) Android TV application with correct folder structure, TV-specific configuration, design tokens, navigation shell, and base fonts (`Inter` + `Amiri`) matching the approved Design System.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/tv/` (root of Expo project)
    *   `apps/tv/app/_layout.tsx` (Root Navigator with font loading)
    *   `apps/tv/constants/theme.ts` (Design tokens as JS constants)
    *   `apps/tv/constants/fonts.ts` (Font family references)
    *   `apps/tv/app.json` (TV-specific: `isTV: true`, no Play Store)
*   **Packages:**
    *   `expo-font` (load Inter + Amiri)
    *   `expo-keep-awake` (prevent TV sleep)
    *   `expo-file-system` (for media caching)
    *   `@react-native-async-storage/async-storage` (config persistence)
    *   `adhan` (prayer time calculation)
*   **Design Tokens (JS):**
    ```ts
    export const Colors = {
        primary: '#059669',
        accent: '#D97706',
        background: '#0F172A',
        surface: '#1E293B',
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
        border: '#334155',
    };
    export const FontSize = {
        displayXL: 96, display: 64, h1: 48, body: 24, caption: 16,
    };
    ```

## Acceptance Criteria (Technical)
*   [ ] App runs on Android emulator/device via `expo start`.
*   [ ] `Inter` and `Amiri` fonts load without error.
*   [ ] `expo-keep-awake` is activated on the root layout (prevents screen sleep).
*   [ ] `app.json` has `"userInterfaceStyle": "dark"` and TV target config.
*   [ ] APK can be built via EAS Build (`eas build --platform android --profile preview`).
*   [ ] TypeScript strict mode enabled.

## Business Rules & Logic
*   App must NOT require Google Play Services to function (sideloading target).
*   App must auto-start and show the main screen without any user interaction.
*   Keep Awake must be always active (TV kiosk logic).

## Dependencies
*   Depends on: JADZ-001 (for Supabase client setup)

## Definition of Done
*   [ ] Project runs on emulator.
*   [ ] APK builds successfully via EAS.
*   [ ] All listed packages installed and configured.
*   [ ] Lint/Type check clear.
