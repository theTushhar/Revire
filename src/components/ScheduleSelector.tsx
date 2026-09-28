import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { HabitScheduleType } from '../models/Habit';
import { colors } from '../theme/colors';
import { spacing, radii } from '../theme/dimensions';
import { typography } from '../theme/typography';
import { hapticUtils } from '../utils/hapticUtils';
import { WEEKDAY_LABELS } from '../utils/constants';

interface ScheduleSelectorProps {
  scheduleType: HabitScheduleType;
  onSelectScheduleType: (type: HabitScheduleType) => void;
  activeDays: number[];
  onToggleDay: (day: number) => void;
}

export function ScheduleSelector({
  scheduleType,
  onSelectScheduleType,
  activeDays,
  onToggleDay,
}: ScheduleSelectorProps) {
  return (
    <View>
      <View style={styles.scheduleToggle}>
        <Pressable
          style={[styles.scheduleBtn, scheduleType === 'daily' && styles.scheduleBtnActive]}
          onPress={() => {
            hapticUtils.selection();
            onSelectScheduleType('daily');
          }}
        >
          <Text
            style={[
              styles.scheduleBtnText,
              scheduleType === 'daily' && styles.scheduleBtnTextActive,
            ]}
          >
            Daily
          </Text>
        </Pressable>
        <Pressable
          style={[styles.scheduleBtn, scheduleType === 'custom' && styles.scheduleBtnActive]}
          onPress={() => {
            hapticUtils.selection();
            onSelectScheduleType('custom');
          }}
        >
          <Text
            style={[
              styles.scheduleBtnText,
              scheduleType === 'custom' && styles.scheduleBtnTextActive,
            ]}
          >
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
                onPress={() => {
                  hapticUtils.selection();
                  onToggleDay(day);
                }}
                style={[styles.dayCircle, isSelected && styles.dayCircleSelected]}
              >
                <Text style={[styles.dayCircleText, isSelected && styles.dayCircleTextSelected]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
