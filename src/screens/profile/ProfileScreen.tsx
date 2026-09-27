import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRealm } from '../../services/Database';
import { useHabitStore } from '../../stores/useHabitStore';
import { InsightsService } from '../../services/InsightsService';
import { TopBar } from '../../components/TopBar';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/dimensions';
import { typography } from '../../theme/typography';
import { dateUtils } from '../../utils/dateUtils';
import { hapticUtils } from '../../utils/hapticUtils';

export function ProfileScreen() {
  const realm = useRealm();
  const { habits, initialize, cleanup } = useHabitStore();
  const [name, setName] = useState('Friend');
  const [avatar, setAvatar] = useState('🦁');
  const [joinedAt, setJoinedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (realm) initialize(realm);
    return () => cleanup();
  }, [realm]);

  useEffect(() => {
    AsyncStorage.getItem('profile_name').then((v) => v && setName(v));
    AsyncStorage.getItem('profile_avatar').then((v) => v && setAvatar(v));
    AsyncStorage.getItem('profile_joined_at').then((v) => v && setJoinedAt(new Date(v)));
  }, []);

  const activeHabits = habits.filter((h) => h.status === 'active');
  const bestCurrentStreak = InsightsService.bestCurrentStreak(activeHabits);
  const xp = InsightsService.xpPoints(habits);
  const completionRate = InsightsService.overallCompletionRate(activeHabits);
  const achievements = InsightsService.achievements(habits);
  const recentActivity = InsightsService.recentActivity(habits, 6);

  const handleResetOnboarding = () => {
    Alert.alert('Reset Onboarding', 'Return the app to the welcome flow?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          hapticUtils.warning();
          await AsyncStorage.removeItem('onboarding_complete');
          router.replace('/(onboarding)');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <TopBar title="PROFILE" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarEmoji}>{avatar}</Text>
          </View>
          <Text style={styles.name}>{name}</Text>
          {joinedAt && (
            <Text style={styles.joined}>JOINED {dateUtils.monthYear(joinedAt).toUpperCase()}</Text>
          )}
        </View>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL HABITS</Text>
            <Text style={styles.statValue}>{habits.length}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>CURRENT STREAK</Text>
            <Text style={styles.statValue}>
              {bestCurrentStreak}
              <Text style={styles.statUnit}> DAYS</Text>
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>XP POINTS</Text>
            <Text style={styles.statValue}>{xp.toLocaleString()}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>COMPLETION</Text>
            <Text style={styles.statValue}>
              {Math.round(completionRate * 100)}
              <Text style={styles.statUnit}>%</Text>
            </Text>
          </Card>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.achievementsRow}
        >
          {achievements.map((a) => (
            <View key={a.id} style={styles.achievementItem}>
              <View
                style={[styles.achievementBadge, a.unlocked && styles.achievementBadgeUnlocked]}
              >
                <MaterialCommunityIcons
                  name={a.icon as any}
                  size={26}
                  color={a.unlocked ? colors.canvas : colors.mute}
                />
              </View>
              <Text style={styles.achievementLabel}>{a.label.toUpperCase()}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
        </View>
        {recentActivity.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No activity yet — complete a habit to see it here.</Text>
          </Card>
        ) : (
          <Card padding={0} style={styles.activityCard}>
            {recentActivity.map((entry, i) => (
              <View
                key={`${entry.habitId}-${entry.date}`}
                style={[
                  styles.activityRow,
                  i < recentActivity.length - 1 && styles.activityRowDivider,
                ]}
              >
                <View style={styles.activityIcon}>
                  <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>Completed '{entry.habitName}'</Text>
                  <Text style={styles.activityMeta}>
                    {dateUtils.friendlyDate(entry.completedAt)} •{' '}
                    {dateUtils.timeOfDay(entry.completedAt)}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        )}

        <View style={styles.actionSection}>
          <Pressable style={styles.resetBtn} onPress={handleResetOnboarding}>
            <Text style={styles.resetBtnText}>Reset Onboarding</Text>
          </Pressable>
          <Text style={styles.versionText}>REVIRE — OFFLINE HABIT TRACKER</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.canvasSoft,
    marginBottom: spacing.md,
  },
  avatarEmoji: {
    fontSize: 42,
  },
  name: {
    ...typography.headlineMd,
    color: colors.ink,
  },
  joined: {
    ...typography.labelMono,
    color: colors.mute,
    marginTop: spacing.xxs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flexBasis: '47%',
    flexGrow: 1,
    height: 100,
    justifyContent: 'space-between',
  },
  statLabel: {
    ...typography.labelMono,
    color: colors.mute,
  },
  statValue: {
    ...typography.headlineMd,
    color: colors.ink,
  },
  statUnit: {
    ...typography.bodySm,
    color: colors.mute,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.labelMonoBold,
    color: colors.ink,
  },
  achievementsRow: {
    marginBottom: spacing.xl,
  },
  achievementItem: {
    alignItems: 'center',
    gap: spacing.xs,
    marginRight: spacing.md,
  },
  achievementBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.canvasSoft,
  },
  achievementBadgeUnlocked: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  achievementLabel: {
    ...typography.labelMono,
    fontSize: 10,
    color: colors.mute,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.xl,
  },
  emptyText: {
    ...typography.bodySm,
    color: colors.mute,
    textAlign: 'center',
  },
  activityCard: {
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  activityRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 112, 243, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    ...typography.bodyMd,
    color: colors.ink,
    fontWeight: '500',
  },
  activityMeta: {
    ...typography.labelMono,
    fontSize: 10,
    color: colors.mute,
    marginTop: 2,
  },
  actionSection: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  resetBtn: {
    width: '100%',
    maxWidth: 280,
    paddingVertical: spacing.md,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
  },
  resetBtnText: {
    ...typography.labelMonoBold,
    color: colors.ink,
    textTransform: 'uppercase',
  },
  versionText: {
    ...typography.labelMono,
    fontSize: 10,
    color: colors.mute,
    marginTop: spacing.md,
  },
});
