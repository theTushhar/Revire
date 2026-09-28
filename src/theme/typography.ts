import { Platform, TextStyle } from 'react-native';

export const fonts = {
  sans: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
  sansMedium: Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'System' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
} as const;

type TextPreset = Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight' | 'fontWeight' | 'letterSpacing'>;

export const typography: Record<
  | 'displayH1'
  | 'h2'
  | 'sectionHeader'
  | 'cardTitle'
  | 'body'
  | 'metadata'
  | 'buttonLabel'
  // Compatibility with older code (mapping to new hierarchy)
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
  // Design System Hierarchy
  displayH1: { fontFamily: fonts.sans, fontSize: 24, lineHeight: 32, fontWeight: '700', letterSpacing: -0.48 }, // 24 * -0.02
  h2: { fontFamily: fonts.sans, fontSize: 20, lineHeight: 26, fontWeight: '600', letterSpacing: -0.2 }, // 20 * -0.01
  sectionHeader: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 22, fontWeight: '600', letterSpacing: -0.08 }, // 16 * -0.005
  cardTitle: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 22, fontWeight: '600', letterSpacing: 0 },
  body: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20, fontWeight: '400', letterSpacing: 0 },
  metadata: { fontFamily: fonts.sans, fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 0.12 }, // 12 * +0.01
  buttonLabel: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 20, fontWeight: '600', letterSpacing: 0 },

  // Backward compatibility mappings
  headlineXl: { fontFamily: fonts.sans, fontSize: 48, lineHeight: 48, fontWeight: '700', letterSpacing: -2.4 }, // Keep original for larger titles if needed, though not in spec
  headlineLg: { fontFamily: fonts.sans, fontSize: 24, lineHeight: 32, fontWeight: '700', letterSpacing: -0.48 }, // Maps to displayH1
  headlineLgMobile: { fontFamily: fonts.sans, fontSize: 24, lineHeight: 32, fontWeight: '700', letterSpacing: -0.48 }, // Maps to displayH1
  headlineMd: { fontFamily: fonts.sans, fontSize: 20, lineHeight: 26, fontWeight: '600', letterSpacing: -0.2 }, // Maps to h2
  headlineSm: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 22, fontWeight: '600', letterSpacing: -0.08 }, // Maps to sectionHeader
  bodyLg: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 22, fontWeight: '400', letterSpacing: 0 },
  bodyMd: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20, fontWeight: '400', letterSpacing: 0 }, // Maps to body
  bodySm: { fontFamily: fonts.sans, fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 0.12 }, // Maps to metadata
  labelMono: { fontFamily: fonts.mono, fontSize: 12, lineHeight: 16, fontWeight: '400', letterSpacing: 0.5 },
  labelMonoBold: { fontFamily: fonts.mono, fontSize: 12, lineHeight: 16, fontWeight: '600', letterSpacing: 0.5 },
};
