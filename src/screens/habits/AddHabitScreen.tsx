import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRealm } from '../../services/Database';
import { useHabitStore } from '../../stores/useHabitStore';
import { HabitService } from '../../services/HabitService';
import { HabitScheduleType } from '../../models/Habit';
import { Card } from '../../components/Card';
import { PillButton } from '../../components/PillButton';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/dimensions';
import { typography } from '../../theme/typography';
import { hapticUtils } from '../../utils/hapticUtils';

const PRESET_ICONS = [
  'book-open-page-variant',
  'water',
  'run',
  'dumbbell',
  'meditation',
  'code-tags',
  'weight-lifter',
  'yoga',
  'bike',
  'food-apple',
  'sleep',
  'pencil-outline',
  'music',
  'brush',
  'laptop',
  'heart-pulse',
] as const;

const PRESET_CATEGORIES = ['General', 'Health', 'Fitness', 'Deep Work', 'Mindfulness', 'Reading'];

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function AddHabitScreen() {
  const realm = useRealm();
  const { add: addHabit, update: updateHabit, remove: removeHabit } = useHabitStore();
  const params = useLocalSearchParams<{ id?: string }>();
  const isEditing = Boolean(params.id);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState<string>(PRESET_ICONS[0]);
  const [category, setCategory] = useState(PRESET_CATEGORIES[0]);
  const [scheduleType, setScheduleType] = useState<HabitScheduleType>('daily');
  const [activeDays, setActiveDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [targetLabel, setTargetLabel] = useState('DAILY');

  useEffect(() => {
    if (!realm || !params.id) return;
    const habit = HabitService.getById(realm, params.id);
    if (!habit) return;
    setName(habit.name);
    setIcon(habit.icon);
    setCategory(habit.category);
    setScheduleType(habit.scheduleType as HabitScheduleType);
    setActiveDays(Array.from(habit.activeDays));
    setTargetLabel(habit.targetLabel);
  }, [realm, params.id]);

  const toggleDay = (day: number) => {
    hapticUtils.selection();
    setActiveDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()));
  };

  const handleSave = () => {
    if (!name.trim() || !realm) {
      hapticUtils.warning();
      return;
    }
    const input = {
      name: name.trim(),
      icon,
      category,
      scheduleType,
      activeDays: scheduleType === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : activeDays,
      targetLabel: targetLabel.trim() || 'DAILY',
    };

    if (isEditing && params.id) {
      updateHabit(realm, params.id, input);
    } else {
      addHabit(realm, input);
    }

    hapticUtils.success();
    router.back();
  };

  const handleDelete = () => {
    if (!realm || !params.id) return;
    Alert.alert('Delete Habit', `Delete "${name}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          hapticUtils.warning();
          removeHabit(realm, params.id!);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{isEditing ? 'Edit Habit' : 'New Habit'}</Text>
        <Text style={styles.subtitle}>Track a routine that helps you build systems that stick.</Text>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Deep Work, Hydration"
            placeholderTextColor={colors.mute}
            value={name}
            onChangeText={setName}
            maxLength={30}
          />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Icon</Text>
          <View style={styles.grid}>
            {PRESET_ICONS.map((i) => {
              const isSelected = icon === i;
              return (
                <Pressable
                  key={i}
                  style={[styles.iconBox, isSelected && styles.iconBoxSelected]}
                  onPress={() => {
                    hapticUtils.selection();
                    setIcon(i);
                  }}
                >
                  <MaterialCommunityIcons name={i as any} size={22} color={isSelected ? colors.canvas : colors.ink} />
                </Pressable>
              );
            })}
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.chipRow}>
            {PRESET_CATEGORIES.map((c) => {
              const isSelected = category === c;
              return (
                <Pressable
                  key={c}
                  style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                  onPress={() => {
                    hapticUtils.selection();
                    setCategory(c);
                  }}
                >
                  <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>{c}</Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <View style={styles.scheduleToggle}>
            <Pressable
              style={[styles.scheduleBtn, scheduleType === 'daily' && styles.scheduleBtnActive]}
              onPress={() => {
                hapticUtils.selection();
                setScheduleType('daily');
              }}
            >
              <Text style={[styles.scheduleBtnText, scheduleType === 'daily' && styles.scheduleBtnTextActive]}>
                Daily
              </Text>
            </Pressable>
            <Pressable
              style={[styles.scheduleBtn, scheduleType === 'custom' && styles.scheduleBtnActive]}
              onPress={() => {
                hapticUtils.selection();
                setScheduleType('custom');
              }}
            >
              <Text style={[styles.scheduleBtnText, scheduleType === 'custom' && styles.scheduleBtnTextActive]}>
                Custom Days
              </Text>
            </Pressable>
          </View>
          {scheduleType === 'custom' && (
            <View style={styles.dayRow}>
              {WEEKDAY_LABELS.map((label, day) => {
                const isSelected = activeDays.includes(day);
                return (
                  <Pressable
                    key={day}
                    onPress={() => toggleDay(day)}
                    style={[styles.dayCircle, isSelected && styles.dayCircleSelected]}
                  >
                    <Text style={[styles.dayCircleText, isSelected && styles.dayCircleTextSelected]}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Target Label</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. 45 MINS, 2.5 LITERS"
            placeholderTextColor={colors.mute}
            value={targetLabel}
            onChangeText={setTargetLabel}
            maxLength={20}
          />
        </Card>

        <PillButton title="Save Habit" onPress={handleSave} disabled={!name.trim()} style={styles.saveBtn} />

        {isEditing ? (
          <Pressable style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteText}>Delete Habit</Text>
          </Pressable>
        ) : null}

        <Pressable
          style={styles.cancelBtn}
          onPress={() => {
            hapticUtils.selection();
            router.back();
          }}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.ink,
    marginTop: spacing.sm,
    marginBottom: spacing.xxs,
  },
  subtitle: {
    ...typography.bodySm,
    color: colors.mute,
    marginBottom: spacing.lg,
  },
  card: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.labelMono,
    color: colors.mute,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  textInput: {
    height: 50,
    backgroundColor: colors.canvasSoft,
    borderRadius: radii.sm,
    borderColor: colors.hairline,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    color: colors.ink,
    fontSize: 16,
  },
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
  scheduleToggle: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  scheduleBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
  },
  scheduleBtnActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  scheduleBtnText: {
    ...typography.labelMonoBold,
    color: colors.ink,
  },
  scheduleBtnTextActive: {
    color: colors.canvas,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  dayCircleText: {
    ...typography.labelMonoBold,
    color: colors.ink,
  },
  dayCircleTextSelected: {
    color: colors.canvas,
  },
  saveBtn: {
    marginTop: spacing.md,
  },
  deleteBtn: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  deleteText: {
    ...typography.labelMonoBold,
    color: colors.error,
  },
  cancelBtn: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    ...typography.bodyMd,
    color: colors.mute,
    fontWeight: '600',
  },
});
