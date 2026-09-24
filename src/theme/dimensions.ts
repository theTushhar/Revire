// Strive spacing scale — 4px base unit, see /design/strive-design-system/strive/DESIGN.md
export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  huge: 96,
} as const;

export const radii = {
  sm: 6,
  md: 8,
  lg: 12,
  pill: 100,
  full: 999,
} as const;

export const dimensions = {
  ...spacing,
  screenPadding: spacing.md,
  buttonHeight: 56,
  iconButton: 40,
  navBarHeight: 60,
  progressRing: 256,
} as const;
