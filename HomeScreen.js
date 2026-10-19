import React, { useEffect, useState } from 'react';
import {
  View, Text, Pressable, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Background from '../components/Background';
import GlassCard from '../components/GlassCard';
import Orb from '../components/Orb';
import NavPill from '../components/NavPill';
import { useApp } from '../context/AppContext';
import { fetchHeadlines } from '../services/headlines';
import { colors, font } from '../theme';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { messages, tasks, orbState, setOrbState, sendMessage, stop, toggleTask } = useApp();
  const [headlines, setHeadlines] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => { fetchHeadlines().then(setHeadlines); }, []);

  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const lastArcher = [...messages].reverse().find((m) => m.role === 'archer');
  const done = tasks.filter((t) => t.done).length;
  const progress = tasks.length ? done / tasks.length : 0;

  const submit = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const statusLabel = { idle: 'IDLE', listening: 'LISTENING', thinking: 'THINKING', speaking: 'SPEAKING' }[orbState];

  return (
    <Background>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: 12, gap: 14 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={{ width: 34 }} />
            <View style={styles.brand}>
              <Ionicons name="hardware-chip-outline" size={13} color={colors.accent} />
              <Text style={styles.brandText}>ARCHER AI</Text>
            </View>
            <Pressable onPress={() => navigation.navigate('Settings')} hitSlop={8}>
              <View style={styles.gear}>
                <Ionicons name="settings-sharp" size={14} color={colors.bg0} />
              </View>
            </Pressable>
          </View>

          {/* Transcript */}
          <GlassCard borderColor={colors.accent + 'aa'} radius={14} padding={10}>
            <Text style={styles.cardLabel}>TRANSCRIPT</Text>
            <View style={styles.row}>
              <Text style={[styles.who, { color: colors.accent }]}>ARCHER</Text>
              <Text style={[styles.who, { color: colors.text }]}>YOU</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.msg} numberOfLines={3}>{lastArcher?.text}</Text>
              <Text style={[styles.msg, { textAlign: 'right' }]} numberOfLines={3}>{lastUser?.text || '—'}</Text>
            </View>
          </GlassCard>

          {/* Orb + nav */}
          <View style={styles.orbRow}>
            <View style={styles.pills}>
              <NavPill label="MEMORY" icon="albums-outline" color={colors.cyan} onPress={() => navigation.navigate('Memory')} />
              <NavPill label="CHAT" icon="chatbubble-outline" color={colors.orange} onPress={() => navigation.navigate('Chat')} />
              <NavPill label="SOUL" icon="sparkles-outline" color={colors.silver} onPress={() => navigation.navigate('Soul')} />
              <NavPill label="SETTINGS" icon="options-outline" color={colors.accent} onPress={() => navigation.navigate('Settings')} />
            </View>
            <View style={{ alignItems: 'center' }}>
              <Orb state={orbState} size={190} />
              <Text style={styles.status}>{statusLabel}</Text>
            </View>
          </View>

          {/* Stop */}
          <View style={styles.stopRow}>
            <Pressable onPress={stop} style={styles.stop}>
              <Ionicons name="stop" size={10} color={colors.danger} />
              <Text style={styles.stopText}>STOP</Text>
            </Pressable>
          </View>

          {/* Headlines + Tasks */}
          <View style={styles.bottomRow}>
            <View style={{ flex: 1.15 }}>
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>TODAY HEADLINES</Text>
                <Ionicons name="chevron-forward" size={10} color={colors.cyan} />
              </View>
              {headlines.map((h) => (
                <View key={h.id} style={styles.headline}>
                  <View style={styles.bar} />
                  <Text style={styles.headlineText} numberOfLines={1}>{h.source} | {h.title}</Text>
                </View>
              ))}
            </View>

            <GlassCard style={{ flex: 1 }} radius={16} padding={10} borderColor="rgba(255,255,255,0.4)">
              <Text style={styles.sectionTitle}>TODAY TASKS</Text>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${progress * 100}%` }]} />
              </View>
              {tasks.slice(0, 4).map((t) => (
                <Pressable key={t.id} onPress={() => toggleTask(t.id)} style={styles.task}>
                  <Ionicons name={t.done ? 'checkmark-circle' : 'ellipse-outline'} size={11} color={t.done ? colors.accent : colors.cyan} />
                  <Text style={[styles.taskText, t.done && { textDecorationLine: 'line-through', opacity: 0.5 }]} numberOfLines={1}>
                    {t.text}
                  </Text>
                </Pressable>
              ))}
              {tasks.length === 0 && <Text style={styles.taskText}>No tasks</Text>}
            </GlassCard>
          </View>
        </ScrollView>

        {/* Command bar */}
        <View style={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 8 }}>
          <GlassCard radius={999} padding={0} intensity={45}>
            <View style={styles.inputRow}>
              <TextInput
                value={input}
                onChangeText={setInput}
                onFocus={() => orbState === 'idle' && setOrbState('listening')}
                onBlur={() => orbState === 'listening' && setOrbState('idle')}
                onSubmitEditing={submit}
                placeholder="Ask Archer anything…"
                placeholderTextColor={colors.muted}
                style={styles.input}
                returnKeyType="send"
              />
              <Pressable onPress={submit} style={styles.send}>
                <Ionicons name="arrow-up" size={16} color={colors.bg0} />
              </Pressable>
            </View>
          </GlassCard>
        </View>
      </KeyboardAvoidingView>
    </Background>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandText: { color: colors.text, fontSize: 11, fontWeight: '800', letterSpacing: 2.5 },
  gear: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  cardLabel: { color: colors.accent, fontSize: 8, fontWeight: '800', letterSpacing: 1.5, marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  who: { fontSize: 8, fontWeight: '800', letterSpacing: 1.5, flex: 1 },
  msg: { color: colors.text, fontSize: 11, lineHeight: 15, flex: 1, marginTop: 3 },
  orbRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pills: { gap: 10 },
  status: { color: colors.cyan, fontSize: 8, fontWeight: '800', letterSpacing: 2, marginTop: 2 },
  stopRow: { alignItems: 'center' },
  stop: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 18,
    borderRadius: 999, borderWidth: 1.2, borderColor: colors.danger, backgroundColor: 'rgba(255,77,109,0.1)',
  },
  stopText: { color: colors.danger, fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
  bottomRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  sectionTitle: { color: colors.text, fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  headline: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 9 },
  bar: { width: 2.5, height: 12, backgroundColor: colors.cyan, borderRadius: 2 },
  headlineText: { color: colors.text, fontSize: 9.5, flex: 1 },
  track: { height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 8, overflow: 'hidden' },
  fill: { height: 3, backgroundColor: colors.cyan },
  task: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 7 },
  taskText: { color: colors.text, fontSize: 9.5, flex: 1 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingLeft: 18, paddingRight: 6, paddingVertical: 6 },
  input: { flex: 1, color: colors.text, fontSize: font.body, paddingVertical: 8 },
  send: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
});
