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
    container: {
      backgroundColor: colors.canvasSoft2,
      borderWidth: 1,
      borderColor: colors.hairline,
    },
    text: { color: colors.mute },
  },
  success: {
    container: { backgroundColor: 'rgba(0, 112, 243, 0.1)' },
    text: { color: colors.success },
  },
  active: {
    container: { backgroundColor: colors.ink },
    text: { color: colors.canvas },
  },
  inverse: {
    container: { backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.hairline },
    text: { color: colors.ink },
  },
};

export function Chip({ label, tone = 'default', onPress, style }: ChipProps) {
  const t = toneStyles[tone];
  return (
    <Pressable onPress={onPress} style={[styles.base, t.container, style]}>
      <Text style={[styles.label, t.text]} numberOfLines={1}>
        {label.toUpperCase()}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
  },
  label: {
    ...typography.labelMono,
    letterSpacing: 0.5,
  },
});
