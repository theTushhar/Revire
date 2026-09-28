import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { colors } from '../theme/colors';
import { radii, spacing } from '../theme/dimensions';
import { typography } from '../theme/typography';

type ChipTone = 'default' | 'success' | 'active' | 'inverse';

interface ChipProps {
  label: string;
  tone?: ChipTone;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const toneStyles: Record<ChipTone, { container: ViewStyle; text: TextStyle }> = {
  default: {
    container: { backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.borderSubtle },
    text: { color: colors.textSecondary },
  },
  success: {
    container: { backgroundColor: colors.primaryLight },
    text: { color: colors.primary },
  },
  active: {
    container: { backgroundColor: colors.primary },
    text: { color: colors.surfaceCard },
  },
  inverse: {
    container: { backgroundColor: colors.surfaceCard, borderWidth: 1, borderColor: colors.borderSubtle },
    text: { color: colors.textPrimary },
  },
};

export function Chip({ label, tone = 'default', onPress, style }: ChipProps) {
  const t = toneStyles[tone];
  return (
    <Pressable onPress={onPress} style={[styles.base, t.container, style]}>
      <Text style={[styles.label, t.text]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
  },
  label: {
    ...typography.metadata,
  },
});
