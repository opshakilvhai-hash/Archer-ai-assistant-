import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenShell from '../components/ScreenShell';
import GlassCard from '../components/GlassCard';
import { useApp } from '../context/AppContext';
import { colors, font } from '../theme';

export default function MemoryScreen({ navigation }) {
  const { memory, addMemory, removeMemory, tasks, addTask, removeTask, toggleTask } = useApp();
  const [note, setNote] = useState('');
  const [task, setTask] = useState('');

  return (
    <ScreenShell title="Memory" navigation={navigation}>
      <FlatList
        data={memory}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
        ListHeaderComponent={
          <View style={{ gap: 14, marginBottom: 6 }}>
            <GlassCard radius={18} padding={12}>
              <Text style={styles.label}>ADD A MEMORY</Text>
              <View style={styles.row}>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="e.g. My sister's birthday is June 3"
                  placeholderTextColor={colors.muted}
                  style={styles.input}
                  onSubmitEditing={() => { if (note.trim()) { addMemory(note.trim()); setNote(''); } }}
                />
                <Pressable style={styles.add} onPress={() => { if (note.trim()) { addMemory(note.trim()); setNote(''); } }}>
                  <Ionicons name="add" size={18} color={colors.bg0} />
                </Pressable>
              </View>
              <Text style={styles.hint}>Tip: tell Archer "remember …" in chat and it saves here.</Text>
            </GlassCard>

            <GlassCard radius={18} padding={12} borderColor={colors.cyan + '88'}>
              <Text style={styles.label}>TASKS</Text>
              {tasks.map((t) => (
                <View key={t.id} style={styles.taskRow}>
                  <Pressable onPress={() => toggleTask(t.id)}>
                    <Ionicons name={t.done ? 'checkmark-circle' : 'ellipse-outline'} size={18} color={t.done ? colors.accent : colors.cyan} />
                  </Pressable>
                  <Text style={[styles.text, { flex: 1 }, t.done && { textDecorationLine: 'line-through', opacity: 0.5 }]}>{t.text}</Text>
                  <Pressable onPress={() => removeTask(t.id)} hitSlop={8}>
                    <Ionicons name="close" size={16} color={colors.muted} />
                  </Pressable>
                </View>
              ))}
              <View style={[styles.row, { marginTop: 8 }]}>
                <TextInput
                  value={task}
                  onChangeText={setTask}
                  placeholder="New task"
                  placeholderTextColor={colors.muted}
                  style={styles.input}
                  onSubmitEditing={() => { if (task.trim()) { addTask(task.trim()); setTask(''); } }}
                />
                <Pressable style={[styles.add, { backgroundColor: colors.cyan }]} onPress={() => { if (task.trim()) { addTask(task.trim()); setTask(''); } }}>
                  <Ionicons name="add" size={18} color={colors.bg0} />
                </Pressable>
              </View>
            </GlassCard>

            <Text style={[styles.label, { marginTop: 4 }]}>SAVED MEMORIES ({memory.length})</Text>
          </View>
        }
        renderItem={({ item }) => (
          <GlassCard radius={16} padding={12}>
            <View style={styles.row}>
              <Text style={[styles.text, { flex: 1 }]}>{item.text}</Text>
              <Pressable onPress={() => removeMemory(item.id)} hitSlop={8}>
                <Ionicons name="trash-outline" size={16} color={colors.danger} />
              </Pressable>
            </View>
          </GlassCard>
        )}
        ListEmptyComponent={<Text style={styles.hint}>Nothing saved yet.</Text>}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.accent, fontSize: 9, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: { flex: 1, color: colors.text, fontSize: font.body, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.glassBorder },
  add: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  hint: { color: colors.muted, fontSize: font.small, marginTop: 8 },
  text: { color: colors.text, fontSize: font.body, lineHeight: 20 },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
});
