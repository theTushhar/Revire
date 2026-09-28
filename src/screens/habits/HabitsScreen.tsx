import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRealm } from '../../services/Database';
import { useHabitStore } from '../../stores/useHabitStore';
import { HabitStatus } from '../../models/Habit';
import { TopBar } from '../../components/TopBar';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { WeekBarChart } from '../../components/WeekBarChart';
import { InsightsService } from '../../services/InsightsService';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/dimensions';
import { typography } from '../../theme/typography';
import { hapticUtils } from '../../utils/hapticUtils';

const TABS: { key: HabitStatus; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'paused', label: 'Paused' },
  { key: 'completed', label: 'Completed' },
];

export function HabitsScreen() {
  const realm = useRealm();
  const { habits, initialize, cleanup } = useHabitStore();
  const [tab, setTab] = useState<HabitStatus>('active');

  useEffect(() => {
    if (realm) initialize(realm);
    return () => cleanup();
  }, [realm]);

  const filtered = habits.filter((h) => h.status === tab);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroRow}>
          <Text style={styles.heroTitle}>All Habits</Text>
          <Text style={styles.heroCount}>{habits.length} TOTAL</Text>
        </View>
        <Text style={styles.heroSubtitle}>
          Precision tracking for peak performance. Monitor your consistency and iterate on your
          daily systems.
        </Text>

        <View style={styles.tabBar}>
          {TABS.map((t) => (
            <Pressable
              key={t.key}
              onPress={() => setTab(t.key)}
              style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]}
            >
              <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        {filtered.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No {tab} habits.</Text>
          </Card>
        ) : (
          <View style={styles.list}>
            {filtered.map((habit) => {
              const days = InsightsService.weekBoolArray(habit);
              const streakUnit = habit.scheduleType === 'daily' ? 'DAY STREAK' : 'WEEK STREAK';
              return (
                <Pressable
                  key={habit._id.toHexString()}
                  onPress={() => {
                    hapticUtils.selection();
                    router.push({
                      pathname: '/habits/add',
                      params: { id: habit._id.toHexString() },
                    });
                  }}
                >
                  <Card style={styles.habitCard}>
                    <View style={styles.cardTop}>
                      <View style={styles.cardTopLeft}>
                        <View style={styles.cardTitleRow}>
                          <MaterialCommunityIcons
                            name={habit.icon as any}
                            size={18}
                            color={colors.ink}
                          />
                          <Chip
                            label={habit.scheduleType === 'daily' ? 'Daily' : 'Custom'}
                            tone={habit.scheduleType === 'daily' ? 'success' : 'default'}
                          />
                        </View>
                        <Text style={styles.habitName}>{habit.name}</Text>
                      </View>
                      <View style={styles.cardTopRight}>
                        <Text style={styles.streakValue}>
                          {String(habit.currentStreak).padStart(2, '0')}
                        </Text>
                        <Text style={styles.streakUnit}>{streakUnit}</Text>
                      </View>
                    </View>
                    <View style={styles.chartRow}>
                      <WeekBarChart days={days} />
                      <Text style={styles.chartLabel}>LAST 7 DAYS</Text>
                    </View>
                  </Card>
                </Pressable>
              );
            })}
          </View>
        )}
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
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: 120,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitle: {
    ...typography.headlineLgMobile,
    color: colors.ink,
  },
  heroCount: {
    ...typography.labelMono,
    color: colors.mute,
  },
  heroSubtitle: {
    ...typography.bodyMd,
    color: colors.mute,
    marginTop: spacing.xxs,
    marginBottom: spacing.lg,
  },
  tabBar: {
    flexDirection: 'row',
    gap: spacing.xxs,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radii.md,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: spacing.xs,
    borderRadius: radii.md - 2,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: colors.ink,
  },
  tabText: {
    ...typography.labelMonoBold,
    color: colors.mute,
  },
  tabTextActive: {
    color: colors.canvas,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.mute,
  },
  list: {
    gap: spacing.md,
  },
  habitCard: {},
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  cardTopLeft: {
    gap: spacing.xxs,
    flexShrink: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  habitName: {
    ...typography.headlineMd,
    fontSize: 20,
    color: colors.ink,
  },
  cardTopRight: {
    alignItems: 'flex-end',
  },
  streakValue: {
    ...typography.labelMonoBold,
    fontSize: 20,
    color: colors.ink,
  },
  streakUnit: {
    ...typography.labelMono,
    fontSize: 10,
    color: colors.mute,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
  },
  chartLabel: {
    ...typography.labelMono,
    fontSize: 10,
    color: colors.mute,
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
