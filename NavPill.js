import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function NavPill({ label, icon, color, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
      <View style={[styles.pill, { borderColor: color }]}>
        <BlurView intensity={25} tint="dark" experimentalBlurMethod="dimezisBlurView" style={StyleSheet.absoluteFill} />
        <View style={[styles.icon, { borderColor: color }]}>
          <Ionicons name={icon} size={9} color={color} />
        </View>
        <Text style={[styles.label, { color }]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1.2,
    overflow: 'hidden',
    minWidth: 96,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  icon: { width: 16, height: 16, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
});
