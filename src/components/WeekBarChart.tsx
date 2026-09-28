import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface WeekBarChartProps {
  days: boolean[]; // 7 entries, oldest to newest
  height?: number;
}

export function WeekBarChart({ days, height = 48 }: WeekBarChartProps) {
  return (
    <View style={[styles.row, { height }]}>
      {days.map((done, i) => (
        <View key={i} style={styles.barTrack}>
          <View
            style={[
              styles.bar,
              {
                height: done ? '100%' : '12%',
                backgroundColor: done ? colors.ink : colors.hairline,
              },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    flex: 1,
  },
  barTrack: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 2,
  },
});
