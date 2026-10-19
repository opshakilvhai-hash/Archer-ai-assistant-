import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Background from './Background';
import GlassCard from './GlassCard';
import { colors, font } from '../theme';

export default function ScreenShell({ title, navigation, children, right }) {
  const insets = useSafeAreaInsets();
  return (
    <Background>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <GlassCard radius={14} padding={8} intensity={30}>
            <Ionicons name="chevron-back" size={18} color={colors.text} />
          </GlassCard>
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <View style={{ width: 36 }}>{right}</View>
      </View>
      <View style={[styles.body, { paddingBottom: insets.bottom + 8 }]}>{children}</View>
    </Background>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 10 },
  title: { color: colors.text, fontSize: font.title, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' },
  body: { flex: 1, paddingHorizontal: 16 },
});
