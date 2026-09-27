import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRealm } from '../../services/Database';
import { useHabitStore } from '../../stores/useHabitStore';
import { HabitService } from '../../services/HabitService';
import { InsightsService } from '../../services/InsightsService';
import { TopBar } from '../../components/TopBar';
import { ProgressRing } from '../../components/ProgressRing';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/dimensions';
import { typography } from '../../theme/typography';
import { strings } from '../../theme/strings';
import { hapticUtils } from '../../utils/hapticUtils';
import { dateUtils } from '../../utils/dateUtils';

export function HomeScreen() {
  const realm = useRealm();
  const { habits, initialize, cleanup, toggleToday } = useHabitStore();
  const [userAvatar, setUserAvatar] = useState('🦁');

  useEffect(() => {
    if (realm) initialize(realm);
    return () => cleanup();
  }, [realm]);

  useEffect(() => {
    AsyncStorage.getItem('profile_avatar').then((v) => v && setUserAvatar(v));
  }, []);

  const activeHabits = habits.filter((h) => h.status === 'active');
  const today = new Date();
  const todaysHabits = activeHabits.filter((h) => HabitService.isScheduledOn(h, today));
  const progress = InsightsService.progressOn(activeHabits, today);
  const bestCurrentStreak = InsightsService.bestCurrentStreak(activeHabits);

  const handleToggle = (id: string) => {
    if (!realm) return;
    hapticUtils.success();
    toggleToday(realm, id);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <TopBar
        avatarEmoji={userAvatar}
        right={
          bestCurrentStreak > 0 ? (
            <View style={styles.streakChip}>
              <MaterialCommunityIcons name="fire" size={16} color={colors.warning} />
              <Text style={styles.streakChipText}>{bestCurrentStreak} DAYS</Text>
            </View>
          ) : undefined
        }
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.ringSection}>
          <ProgressRing progress={progress.ratio} size={220}>
            <Text style={styles.ringPercent}>{Math.round(progress.ratio * 100)}%</Text>
            <Text style={styles.ringLabel}>{strings.dailyProgress}</Text>
          </ProgressRing>
        </View>

        <View style={styles.focusHeader}>
          <Text style={styles.focusTitle}>{strings.todaysFocus}</Text>
          <Text style={styles.focusDate}>{dateUtils.friendlyDate(today).toUpperCase()}</Text>
        </View>

        {todaysHabits.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No habits scheduled for today.</Text>
            <Text style={styles.emptySubtext}>Tap + to create your first habit.</Text>
          </Card>
        ) : (
          <View style={styles.habitList}>
            {todaysHabits.map((habit) => {
              const isDone = HabitService.isCompletedToday(habit);
              return (
                <Card key={habit._id.toHexString()} style={styles.habitCard} padding={spacing.md}>
                  <View style={styles.habitRow}>
                    <View style={styles.iconBadge}>
                      <MaterialCommunityIcons
                        name={habit.icon as any}
                        size={22}
                        color={colors.ink}
                      />
                    </View>
                    <View style={styles.habitInfo}>
                      <Text style={styles.habitName} numberOfLines={1}>
                        {habit.name}
                      </Text>
                      <Text style={styles.habitTarget}>{habit.targetLabel}</Text>
                    </View>
                    <Pressable
                      onPress={() => handleToggle(habit._id.toHexString())}
                      style={[styles.checkBtn, isDone && styles.checkBtnDone]}
                    >
                      <MaterialCommunityIcons
                        name="check"
                        size={20}
                        color={isDone ? colors.canvas : colors.hairline}
                      />
                    </Pressable>
                  </View>
                </Card>
              );
            })}
          </View>
        )}

        <View style={styles.quoteSection}>
          <MaterialCommunityIcons
            name="format-quote-open"
            size={20}
            color={colors.hairline}
            style={styles.quoteIcon}
          />
          <Text style={styles.quoteText}>{strings.quote}</Text>
          <Text style={styles.quoteAttribution}>{strings.quoteAttribution}</Text>
        </View>
      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={() => {
          hapticUtils.selection();
          router.push('/habits/add');
        }}
      >
        <MaterialCommunityIcons name="plus" size={28} color={colors.canvas} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  streakChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: colors.canvasSoft2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  streakChipText: {
    ...typography.labelMonoBold,
    color: colors.ink,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 120,
  },
  ringSection: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  ringPercent: {
    ...typography.headlineXl,
    fontSize: 44,
    color: colors.ink,
  },
  ringLabel: {
    ...typography.labelMono,
    color: colors.mute,
    marginTop: spacing.xxs,
  },
  focusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  focusTitle: {
    ...typography.headlineMd,
    color: colors.ink,
  },
  focusDate: {
    ...typography.labelMono,
    color: colors.mute,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.ink,
    fontWeight: '600',
  },
  emptySubtext: {
    ...typography.bodySm,
    color: colors.mute,
    marginTop: spacing.xxs,
  },
  habitList: {
    gap: spacing.sm,
  },
  habitCard: {},
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.canvasSoft2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  habitName: {
    ...typography.headlineSm,
    color: colors.ink,
  },
  habitTarget: {
    ...typography.labelMono,
    color: colors.mute,
    marginTop: 2,
  },
  checkBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBtnDone: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  quoteSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    alignItems: 'center',
  },
  quoteIcon: {
    marginBottom: spacing.xs,
  },
  quoteText: {
    ...typography.bodyLg,
    fontStyle: 'italic',
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  quoteAttribution: {
    ...typography.labelMono,
    color: colors.mute,
    marginTop: spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
