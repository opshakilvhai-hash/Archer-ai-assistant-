import React from 'react';
import { View, Text, TextInput, Switch, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import ScreenShell from '../components/ScreenShell';
import GlassCard from '../components/GlassCard';
import { useApp } from '../context/AppContext';
import { colors, font } from '../theme';

const RATES = [0.8, 1, 1.2];

export default function SettingsScreen({ navigation }) {
  const { settings, setSettings, resetAll, clearChat, error } = useApp();
  const set = (patch) => setSettings((s) => ({ ...s, ...patch }));

  const confirmReset = () =>
    Alert.alert('Reset Archer?', 'This deletes chat, memories, tasks and settings.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: resetAll },
    ]);

  return (
    <ScreenShell title="Settings" navigation={navigation}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
        <GlassCard radius={18}>
          <Text style={styles.label}>AI CONNECTION</Text>
          <Text style={styles.sub}>API key (stored only on this device)</Text>
          <TextInput
            value={settings.apiKey}
            onChangeText={(apiKey) => set({ apiKey: apiKey.trim() })}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="sk-ant-…"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
          <Text style={[styles.sub, { marginTop: 14 }]}>Model</Text>
          <TextInput
            value={settings.model}
            onChangeText={(model) => set({ model: model.trim() })}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
          {!settings.apiKey && <Text style={styles.warn}>No key set: Archer runs in offline mode.</Text>}
          {error && <Text style={[styles.warn, { color: colors.danger }]}>{error}</Text>}
        </GlassCard>

        <GlassCard radius={18}>
          <Text style={styles.label}>VOICE</Text>
          <View style={styles.row}>
            <Text style={styles.text}>Speak replies aloud</Text>
            <Switch
              value={settings.voice}
              onValueChange={(voice) => set({ voice })}
              trackColor={{ true: colors.accent + '99', false: 'rgba(255,255,255,0.2)' }}
              thumbColor={settings.voice ? colors.accent : '#ccc'}
            />
          </View>
          <Text style={[styles.sub, { marginTop: 14 }]}>Speech rate</Text>
          <View style={styles.chips}>
            {RATES.map((r) => {
              const on = settings.rate === r;
              return (
                <Pressable key={r} onPress={() => set({ rate: r })} style={[styles.chip, on && styles.chipOn]}>
                  <Text style={[styles.chipText, on && { color: colors.bg0 }]}>{r}x</Text>
                </Pressable>
              );
            })}
          </View>
        </GlassCard>

        <GlassCard radius={18} borderColor={colors.danger + '88'}>
          <Text style={[styles.label, { color: colors.danger }]}>DATA</Text>
          <Pressable onPress={clearChat} style={styles.btn}><Text style={styles.btnText}>Clear chat history</Text></Pressable>
          <Pressable onPress={confirmReset} style={[styles.btn, { borderColor: colors.danger }]}>
            <Text style={[styles.btnText, { color: colors.danger }]}>Reset everything</Text>
          </Pressable>
        </GlassCard>

        <Text style={styles.footer}>Archer AI · v1.0.0</Text>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.accent, fontSize: 9, fontWeight: '800', letterSpacing: 1.5, marginBottom: 10 },
  sub: { color: colors.muted, fontSize: font.small, marginBottom: 6 },
  text: { color: colors.text, fontSize: font.body },
  input: { color: colors.text, fontSize: font.body, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.glassBorder },
  warn: { color: colors.gold, fontSize: font.small, marginTop: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chips: { flexDirection: 'row', gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1, borderColor: colors.glassBorder, backgroundColor: 'rgba(255,255,255,0.05)' },
  chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.text, fontSize: font.small, fontWeight: '700' },
  btn: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: colors.glassBorder, marginBottom: 10, alignItems: 'center' },
  btnText: { color: colors.text, fontSize: font.body, fontWeight: '600' },
  footer: { color: colors.muted, fontSize: font.tiny, textAlign: 'center', letterSpacing: 1 },
});
