import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface Props {
  color: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
}

export default function HalftoneBackground({ color, children, width = 350, height = 90 }: Props) {
  const dots: React.ReactNode[] = [];
  const spacing = 20;
  const dotSize = 3;

  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      dots.push(
        <Circle key={`${x}-${y}`} cx={x} cy={y} r={dotSize} fill={color} fillOpacity={0.25} />
      );
    }
  }

  return (
    <View style={styles.container}>
      <Svg
        style={StyleSheet.absoluteFill}
        width={width}
        height={height}
      >
        {dots}
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
