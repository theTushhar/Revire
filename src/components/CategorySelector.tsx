import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, radii } from '../theme/dimensions';
import { typography } from '../theme/typography';
import { hapticUtils } from '../utils/hapticUtils';
import { PRESET_CATEGORIES } from '../utils/constants';

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategorySelector({ selectedCategory, onSelectCategory }: CategorySelectorProps) {
  return (
    <View style={styles.chipRow}>
      {PRESET_CATEGORIES.map((c) => {
        const isSelected = selectedCategory === c;
        return (
          <Pressable
            key={c}
            style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
            onPress={() => {
              hapticUtils.selection();
              onSelectCategory(c);
            }}
          >
            <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>
              {c}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  categoryChipSelected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  categoryChipText: {
    ...typography.labelMono,
    color: colors.ink,
  },
  categoryChipTextSelected: {
    color: colors.canvas,
  },
});
