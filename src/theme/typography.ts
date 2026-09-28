import { Platform, TextStyle } from 'react-native';

// TODO: swap for real Geist / Geist Mono font files (see ARCHITECTURE.md §5) —
// using system font fallbacks for now so the type *scale* (size/weight/tracking)
// is already faithful to the design even before the real typeface is bundled.
export const fonts = {
  sans: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
  sansMedium: Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'System' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
} as const;

type TextPreset = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'lineHeight' | 'fontWeight' | 'letterSpacing'
>;

export const typography: Record<
  | 'headlineXl'
  | 'headlineLg'
  | 'headlineLgMobile'
  | 'headlineMd'
  | 'headlineSm'
  | 'bodyLg'
  | 'bodyMd'
  | 'bodySm'
  | 'labelMono'
  | 'labelMonoBold',
  TextPreset
> = {
  headlineXl: {
    fontFamily: fonts.sans,
    fontSize: 48,
    lineHeight: 48,
    fontWeight: '600',
    letterSpacing: -2.4,
  },
  headlineLg: {
    fontFamily: fonts.sans,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '600',
    letterSpacing: -1.28,
  },
  headlineLgMobile: {
    fontFamily: fonts.sans,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '600',
    letterSpacing: -1.0,
  },
  headlineMd: {
    fontFamily: fonts.sans,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    letterSpacing: -0.96,
  },
  headlineSm: {
    fontFamily: fonts.sans,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: -0.4,
  },
  bodyLg: {
    fontFamily: fonts.sans,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400',
    letterSpacing: 0,
  },
  bodyMd: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: 0,
  },
  bodySm: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: -0.28,
  },
  labelMono: {
    fontFamily: fonts.mono,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  labelMonoBold: {
    fontFamily: fonts.mono,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
};
