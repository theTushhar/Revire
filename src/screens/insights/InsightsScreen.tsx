import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRealm } from '../../services/Database';
import { useHabitStore } from '../../stores/useHabitStore';
import { InsightsService } from '../../services/InsightsService';
import { TopBar } from '../../components/TopBar';
import { Card } from '../../components/Card';
import { Heatmap } from '../../components/Heatmap';
import { LineTrend } from '../../components/LineTrend';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/dimensions';
import { typography } from '../../theme/typography';
import { hapticUtils } from '../../utils/hapticUtils';

export function InsightsScreen() {
  const realm = useRealm();
  const { habits, initialize, cleanup } = useHabitStore();
  const [categoryFilter, setCategoryFilter] = useState<string>('All Habits');

  useEffect(() => {
    if (realm) initialize(realm);
    return () => cleanup();
  }, [realm]);

  const activeHabits = habits.filter((h) => h.status === 'active');
  const categories = ['All Habits', ...Array.from(new Set(activeHabits.map((h) => h.category)))];
  const filteredHabits =
    categoryFilter === 'All Habits'
      ? activeHabits
      : activeHabits.filter((h) => h.category === categoryFilter);

  const heatmapValues = InsightsService.heatmapValues(filteredHabits, 182);
  const avgConsistency = InsightsService.overallCompletionRate(filteredHabits, 182);
  const trend = InsightsService.weeklyCompletionTrend(filteredHabits, 12);
  const categoryRates = InsightsService.categorySuccessRates(activeHabits);
  const bestStreak = InsightsService.bestStreak(habits);
  const overallCompletion = InsightsService.overallCompletionRate(activeHabits);
  const consistentHour = InsightsService.mostConsistentHour(habits);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Insights</Text>
        <Text style={styles.pageSubtitle}>Visualizing your behavioral performance.</Text>

        <Card style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardLabel}>HABIT CONSISTENCY (6M)</Text>
            <Text style={styles.cardValue}>{Math.round(avgConsistency * 100)}% AVG</Text>
          </View>
          <Heatmap values={heatmapValues} />
        </Card>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {categories.map((c) => {
            const isSelected = categoryFilter === c;
            return (
              <Pressable
                key={c}
                onPress={() => {
                  hapticUtils.selection();
                  setCategoryFilter(c);
                }}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                  {c}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Card style={styles.card}>
          <Text style={styles.cardLabel}>WEEKLY MOMENTUM</Text>
          <LineTrend values={trend} />
          <View style={styles.trendFooter}>
            <Text style={styles.trendFooterText}>12 WEEKS AGO</Text>
            <Text style={styles.trendFooterText}>THIS WEEK</Text>
          </View>
        </Card>

        {categoryRates.length > 0 && (
          <Card style={styles.card}>
            <Text style={styles.cardLabel}>SUCCESS BY CATEGORY</Text>
            <View style={styles.barList}>
              {categoryRates.map((c) => (
                <View key={c.category} style={styles.barRow}>
                  <View style={styles.barLabelRow}>
                    <Text style={styles.barLabel}>{c.category.toUpperCase()}</Text>
                    <Text style={styles.barLabel}>{Math.round(c.rate * 100)}%</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${Math.round(c.rate * 100)}%` }]} />
                  </View>
                </View>
              ))}
            </View>
          </Card>
        )}

        <View style={styles.metricsGrid}>
          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>BEST STREAK</Text>
            <Text style={styles.metricValue}>
              {bestStreak}
              <Text style={styles.metricUnit}> DAYS</Text>
            </Text>
          </Card>
          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>COMPLETION</Text>
            <Text style={styles.metricValue}>
              {(overallCompletion * 100).toFixed(1)}
              <Text style={styles.metricUnit}>%</Text>
            </Text>
          </Card>
          <Card style={[styles.metricCard, styles.metricCardWide]}>
            <Text style={styles.metricLabel}>CONSISTENT TIME</Text>
            <Text style={styles.metricValue}>{formatHour(consistentHour)}</Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatHour(hour: number | null): string {
  if (hour === null) return '—';
  const period = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12.toString().padStart(2, '0')}:00 ${period}`;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: 120,
  },
  pageTitle: {
    ...typography.headlineLgMobile,
    color: colors.ink,
    marginBottom: spacing.xxs,
  },
  pageSubtitle: {
    ...typography.bodySm,
    color: colors.mute,
    marginBottom: spacing.lg,
  },
  card: {
    marginBottom: spacing.lg,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  cardLabel: {
    ...typography.labelMono,
    color: colors.mute,
    marginBottom: spacing.md,
  },
  cardValue: {
    ...typography.labelMonoBold,
    color: colors.ink,
  },
  filterRow: {
    marginBottom: spacing.lg,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.hairline,
    marginRight: spacing.xs,
  },
  filterChipActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  filterChipText: {
    ...typography.labelMono,
    color: colors.ink,
  },
  filterChipTextActive: {
    color: colors.canvas,
  },
  trendFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  trendFooterText: {
    ...typography.labelMono,
    fontSize: 10,
    color: colors.mute,
  },
  barList: {
    gap: spacing.md,
  },
  barRow: {
    gap: spacing.xxs,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barLabel: {
    ...typography.labelMono,
    color: colors.ink,
  },
  barTrack: {
    height: 4,
    backgroundColor: colors.canvasSoft2,
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.ink,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metricCard: {
    flexBasis: '47%',
    flexGrow: 1,
  },
  metricCardWide: {
    flexBasis: '100%',
  },
  metricLabel: {
    ...typography.labelMono,
    color: colors.mute,
    marginBottom: spacing.sm,
  },
  metricValue: {
    ...typography.headlineMd,
    color: colors.ink,
  },
  metricUnit: {
    ...typography.bodySm,
    color: colors.mute,
  },
});
