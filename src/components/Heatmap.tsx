import React, { useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { colors } from '../theme/colors';

interface HeatmapProps {
  values: number[]; // 0..1 ratio per day, oldest to newest
  columns?: number;
}

const GAP = 3;

export function Heatmap({ values, columns = 26 }: HeatmapProps) {
  const [gridWidth, setGridWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    setGridWidth(e.nativeEvent.layout.width);
  };

  const cellSize = gridWidth > 0 ? (gridWidth - GAP * (columns - 1)) / columns : 0;

  return (
    <View style={styles.grid} onLayout={onLayout}>
      {cellSize > 0 &&
        values.map((v, i) => (
          <View
            key={i}
            style={[
              styles.cell,
              {
                width: cellSize,
                height: cellSize,
                marginRight: (i + 1) % columns === 0 ? 0 : GAP,
                marginBottom: GAP,
              },
            ]}
          >
            {v > 0 && <View style={[styles.fill, { opacity: 0.15 + v * 0.85 }]} />}
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    borderRadius: 2,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  fill: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.primary, // Emerald green fills
  },
});
