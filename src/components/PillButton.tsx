import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../theme/colors';
import { radii, spacing, dimensions } from '../theme/dimensions';
import { typography } from '../theme/typography';

interface PillButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}

export function PillButton({
  title,
  onPress,
  variant = 'primary',
  disabled,
  style,
  icon,
}: PillButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        disabled ? styles.disabled : null,
        pressed && !disabled ? styles.pressed : null,
        style,
      ]}
    >
      <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textSecondary]}>
        {title}
      </Text>
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: dimensions.buttonHeight,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  primary: {
    backgroundColor: colors.ink,
    borderRadius: radii.pill,
  },
  secondary: {
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radii.sm,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  text: {
    ...typography.bodyMd,
    fontWeight: '600',
  },
  textPrimary: {
    color: colors.canvas,
  },
  textSecondary: {
    color: colors.ink,
  },
});
