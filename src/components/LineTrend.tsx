import React from 'react';
import { View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { colors } from '../theme/colors';

interface LineTrendProps {
  values: number[];
  height?: number;
}

export function LineTrend({ values, height = 160 }: LineTrendProps) {
  if (values.length < 2) return <View style={{ height }} />;

  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={{ height, width: '100%' }}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Polyline
          points={points}
          fill="none"
          stroke={colors.ink}
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      </Svg>
    </View>
  );
}
