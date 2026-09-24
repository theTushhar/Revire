import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/dimensions';
import { typography } from '../theme/typography';

interface TopBarProps {
  title?: string;
  right?: React.ReactNode;
  avatarEmoji?: string;
}

export function TopBar({ title = 'ReVire', right, avatarEmoji }: TopBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.right}>
        {right}
        {avatarEmoji ? (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarEmoji}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
    backgroundColor: colors.canvas,
  },
  title: {
    ...typography.headlineMd,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.canvasSoft,
  },
  avatarText: {
    fontSize: 16,
  },
});
