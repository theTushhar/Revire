import { TextStyle } from 'react-native';

export const fonts = {
  sans: 'Geist-Regular',
  sansMedium: 'Geist-Medium',
  sansSemiBold: 'Geist-SemiBold',
  mono: 'GeistMono-Regular',
  monoSemiBold: 'GeistMono-SemiBold',
} as const;

type TextPreset = Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight' | 'fontWeight' | 'letterSpacing'>;

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
  headlineXl: { fontFamily: fonts.sansSemiBold, fontSize: 48, lineHeight: 48, letterSpacing: -2.4 },
  headlineLg: { fontFamily: fonts.sansSemiBold, fontSize: 32, lineHeight: 40, letterSpacing: -1.28 },
  headlineLgMobile: { fontFamily: fonts.sansSemiBold, fontSize: 28, lineHeight: 32, letterSpacing: -1.0 },
  headlineMd: { fontFamily: fonts.sansSemiBold, fontSize: 24, lineHeight: 32, letterSpacing: -0.96 },
  headlineSm: { fontFamily: fonts.sansSemiBold, fontSize: 18, lineHeight: 24, letterSpacing: -0.4 },
  bodyLg: { fontFamily: fonts.sans, fontSize: 18, lineHeight: 28, letterSpacing: 0 },
  bodyMd: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  bodySm: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20, letterSpacing: -0.28 },
  labelMono: { fontFamily: fonts.mono, fontSize: 12, lineHeight: 16, letterSpacing: 0.5 },
  labelMonoBold: { fontFamily: fonts.monoSemiBold, fontSize: 12, lineHeight: 16, letterSpacing: 0.5 },
};
