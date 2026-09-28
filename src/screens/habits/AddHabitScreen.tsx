import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useRealm } from '../../services/Database';
import { useHabitStore } from '../../stores/useHabitStore';
import { HabitService } from '../../services/HabitService';
import { HabitScheduleType } from '../../models/Habit';
import { Card } from '../../components/Card';
import { PillButton } from '../../components/PillButton';
import { IconSelector } from '../../components/IconSelector';
import { CategorySelector } from '../../components/CategorySelector';
import { ScheduleSelector } from '../../components/ScheduleSelector';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/dimensions';
import { typography } from '../../theme/typography';
import { hapticUtils } from '../../utils/hapticUtils';

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
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort(),
    );
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
        <Text style={styles.subtitle}>
          Track a routine that helps you build systems that stick.
        </Text>

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
          <IconSelector selectedIcon={icon} onSelectIcon={setIcon} />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Category</Text>
          <CategorySelector selectedCategory={category} onSelectCategory={setCategory} />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <ScheduleSelector
            scheduleType={scheduleType}
            onSelectScheduleType={setScheduleType}
            activeDays={activeDays}
            onToggleDay={toggleDay}
          />
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

        <PillButton
          title="Save Habit"
          onPress={handleSave}
          disabled={!name.trim()}
          style={styles.saveBtn}
        />

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
