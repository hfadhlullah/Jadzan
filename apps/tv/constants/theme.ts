// Design tokens for the Jadzan TV App
// JADZ-003: Matches docs/design-system.md

export const Colors = {
  primary: '#059669',      // Emerald Green
  primaryHover: '#047857',
  accent: '#D97706',       // Gold / Amber
  accentHover: '#B45309',

  background: '#0F172A',   // Rich near-black
  surface: '#1E293B',      // Card / sidebar surface
  surfaceHover: '#273549',

  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',

  border: '#334155',

  success: '#059669',
  warning: '#D97706',
  danger: '#DC2626',
} as const;

export const FontSize = {
  displayXL: 96,  // Current time
  display: 64,    // Iqomah countdown
  h1: 48,         // Prayer name
  h2: 36,
  body: 24,       // News ticker
  caption: 16,    // Metadata, Hijri date
} as const;

export const FontFamily = {
  inter: 'Inter',
  interMedium: 'Inter-Medium',
  interBold: 'Inter-Bold',
  amiri: 'Amiri',
  amiriBold: 'Amiri-Bold',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// TV Layout percentages
export const Layout = {
  sidebarWidth: '25%',   // Zone A — Prayer sidebar
  mediaStageWidth: '75%', // Zone B — Media carousel
  tickerHeight: 60,       // Zone C — News ticker (px)
} as const;
