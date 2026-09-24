import React from 'react';
import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { radii, spacing } from '../theme/dimensions';

interface CardProps {
  children: React.ReactNode;
  padding?: number;
  style?: StyleProp<ViewStyle>;
  elevated?: boolean;
}

export function Card({ children, padding = spacing.md, style, elevated = true }: CardProps) {
  return (
    <View style={[styles.base, { padding }, elevated && styles.elevated, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radii.md,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
});
