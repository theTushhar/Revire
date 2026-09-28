import React from 'react';
import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { radii, spacing, elevation } from '../theme/dimensions';

interface CardProps {
  children: React.ReactNode;
  padding?: number;
  style?: StyleProp<ViewStyle>;
  elevated?: boolean;
}

export function Card({ children, padding = spacing.md, style, elevated = true }: CardProps) {
  return <View style={[styles.base, { padding }, elevated && styles.elevated, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.lg, // Card Medium (rounded-2xl)
  },
  elevated: {
    ...elevation.card,
  },
});
