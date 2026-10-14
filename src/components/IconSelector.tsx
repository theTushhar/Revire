import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, radii } from '../theme/dimensions';
import { hapticUtils } from '../utils/hapticUtils';
import { PRESET_ICONS } from '../utils/constants';

interface IconSelectorProps {
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
}

export function IconSelector({ selectedIcon, onSelectIcon }: IconSelectorProps) {
  return (
    <View style={styles.grid}>
      {PRESET_ICONS.map((i) => {
        const isSelected = selectedIcon === i;
        return (
          <Pressable
            key={i}
            style={[styles.iconBox, isSelected && styles.iconBoxSelected]}
            onPress={() => {
              hapticUtils.selection();
              onSelectIcon(i);
            }}
          >
            <MaterialCommunityIcons
              name={i as any}
              size={22}
              color={isSelected ? colors.canvas : colors.ink}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxSelected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
});
