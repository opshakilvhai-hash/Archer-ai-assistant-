import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

// Fibonacci sphere points, computed once.
const POINTS = (() => {
  const n = 110;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = i * 2.399963;
    pts.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r });
  }
  return pts;
})();

const STATE = {
  idle: { color: colors.accent, spin: 26000, pulse: 3200, ring: 14000 },
  listening: { color: colors.gold, spin: 16000, pulse: 1400, ring: 8000 },
  thinking: { color: colors.orange, spin: 7000, pulse: 900, ring: 4000 },
  speaking: { color: colors.cyan, spin: 11000, pulse: 700, ring: 5500 },
};

function useLoop(duration) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    v.setValue(0);
    const loop = Animated.loop(
      Animated.timing(v, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [duration, v]);
  return v;
}

export default function Orb({ state = 'idle', size = 190 }) {
  const cfg = STATE[state] || STATE.idle;
  const spin = useLoop(cfg.spin);
  const ring1 = useLoop(cfg.ring);
  const ring2 = useLoop(cfg.ring * 1.6);

  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    pulse.setValue(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: cfg.pulse, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: cfg.pulse, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [cfg.pulse, pulse]);

  const rot = (v) => v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const rotRev = (v) => v.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.06] });
  const glowOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.55] });

  const R = size * 0.44;
  const c = size / 2;
  const dots = useMemo(
    () =>
      POINTS.map((p, i) => ({
        key: i,
        cx: c + p.x * R,
        cy: c + p.y * R,
        r: 1 + (p.z + 1) * 0.9,
        o: 0.25 + ((p.z + 1) / 2) * 0.75,
        warm: i % 5 === 0,
      })),
    [R, c]
  );

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: size * 0.95,
          height: size * 0.95,
          borderRadius: size,
          backgroundColor: cfg.color,
          opacity: glowOpacity,
          transform: [{ scale }],
        }}
      />
      <Animated.View style={{ transform: [{ scale }] }}>
        <LinearGradient
          colors={['rgba(255,255,255,0.28)', cfg.color + '33', 'rgba(0,0,0,0.25)']}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={{
            width: size * 0.88,
            height: size * 0.88,
            borderRadius: size,
            borderWidth: 1.2,
            borderColor: cfg.color + 'aa',
          }}
        />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate: rot(spin) }] }]}>
        <Svg width={size} height={size}>
          {dots.map((d) => (
            <Circle key={d.key} cx={d.cx} cy={d.cy} r={d.r} fill={d.warm ? colors.gold : cfg.color} opacity={d.o} />
          ))}
        </Svg>
      </Animated.View>
      <Animated.View
        style={[styles.ring, { width: size, height: size * 0.42, borderColor: colors.gold + 'cc', transform: [{ rotate: rot(ring1) }] }]}
      />
      <Animated.View
        style={[styles.ring, { width: size * 0.92, height: size * 0.3, borderColor: cfg.color + 'bb', transform: [{ rotate: rotRev(ring2) }] }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ring: { position: 'absolute', borderRadius: 999, borderWidth: 1.2 },
});
