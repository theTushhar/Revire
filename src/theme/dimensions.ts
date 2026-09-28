// DocSpot spacing scale — 4px/8px base unit
export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20, // Adjusted to 20px for spacious headers / card padding
  xl: 24, // Major section gaps
  xxl: 32,
  xxxl: 48,
  huge: 64,
} as const;

export const radii = {
  sm: 8,
  md: 12, // Inner Element (rounded-xl)
  lg: 16, // Card Medium (rounded-2xl) 16-20px
  xl: 24, // Card Large (rounded-3xl) 24-28px
  pill: 9999, // Pill / Fully Rounded
  full: 9999,
} as const;

export const dimensions = {
  ...spacing,
  screenPadding: spacing.md, // 16px gutter
  buttonHeight: 44, // Minimum hit target
  iconButton: 44,
  navBarHeight: 64, // Floating Pill Bottom Navigation Dock height
  progressRing: 256,
} as const;

// Elevation styles
export const elevation = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2, // Android
  },
  bottomDock: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8, // Android
  },
  modalSheet: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 12, // Android
  },
} as const;
