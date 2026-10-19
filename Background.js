import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

function Glow({ color, size, top, left, right, bottom, delay = 0 }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 1, duration: 7000, delay, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(t, { toValue: 0, duration: 7000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [t, delay]);
  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [-20, 20] });
  const translateX = t.interpolate({ inputRange: [0, 1], outputRange: [15, -15] });
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: 0.28,
        top,
        left,
        right,
        bottom,
        transform: [{ translateX }, { translateY }],
      }}
    />
  );
}

export default function Background({ children }) {
  return (
    <View style={styles.root}>
      <LinearGradient colors={[colors.bg0, colors.bg1, colors.bg2]} style={StyleSheet.absoluteFill} />
      <Glow color={colors.accent} size={260} top={-60} left={-90} />
      <Glow color={colors.cyan} size={300} top={280} right={-140} delay={1500} />
      <Glow color="#2563eb" size={240} bottom={-60} left={-60} delay={3000} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.bg0 } });
