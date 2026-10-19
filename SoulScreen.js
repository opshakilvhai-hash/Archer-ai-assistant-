import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import ScreenShell from '../components/ScreenShell';
import GlassCard from '../components/GlassCard';
import Orb from '../components/Orb';
import { useApp } from '../context/AppContext';
import { colors, font } from '../theme';

const TONES = [['friendly', 'Friendly'], ['professional', 'Professional'], ['witty', 'Witty']];
const LENGTHS = [['short', 'Short'], ['medium', 'Medium'], ['long', 'Detailed']];

function Chips({ options, value, onChange }) {
  return (
    <View style={styles.chips}>
      {options.map(([k, label]) => {
        const on = value === k;
        return (
          <Pressable key={k} onPress={() => onChange(k)} style={[styles.chip, on && styles.chipOn]}>
            <Text style={[styles.chipText, on && { color: colors.bg0 }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function SoulScreen({ navigation }) {
  const { soul, setSoul, orbState } = useApp();
  const set = (patch) => setSoul((s) => ({ ...s, ...patch }));

  return (
    <ScreenShell title="Soul" navigation={navigation}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingBottom: 20 }}>
        <View style={{ alignItems: 'center' }}>
          <Orb state={orbState} size={170} />
        </View>

        <GlassCard radius={18}>
          <Text style={styles.label}>NAME</Text>
          <TextInput
            value={soul.name}
            onChangeText={(name) => set({ name })}
            style={styles.input}
            placeholder="Archer"
            placeholderTextColor={colors.muted}
          />
        </GlassCard>

        <GlassCard radius={18}>
          <Text style={styles.label}>PERSONALITY</Text>
          <Chips options={TONES} value={soul.tone} onChange={(tone) => set({ tone })} />
        </GlassCard>

        <GlassCard radius={18}>
          <Text style={styles.label}>REPLY LENGTH</Text>
          <Chips options={LENGTHS} value={soul.length} onChange={(length) => set({ length })} />
        </GlassCard>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.accent, fontSize: 9, fontWeight: '800', letterSpacing: 1.5, marginBottom: 10 },
  input: { color: colors.text, fontSize: font.title, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: colors.glassBorder },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: colors.glassBorder, backgroundColor: 'rgba(255,255,255,0.05)' },
  chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.text, fontSize: font.small, fontWeight: '700' },
});
