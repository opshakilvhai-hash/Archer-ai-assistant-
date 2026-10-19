import React, { useRef, useState } from 'react';
import { View, Text, FlatList, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenShell from '../components/ScreenShell';
import GlassCard from '../components/GlassCard';
import { useApp } from '../context/AppContext';
import { colors, font } from '../theme';

export default function ChatScreen({ navigation }) {
  const { messages, sendMessage, orbState, clearChat } = useApp();
  const [input, setInput] = useState('');
  const list = useRef(null);

  const submit = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <ScreenShell
      title="Chat"
      navigation={navigation}
      right={
        <Pressable onPress={clearChat} hitSlop={10} style={{ alignItems: 'flex-end' }}>
          <Ionicons name="trash-outline" size={20} color={colors.muted} />
        </Pressable>
      }
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
        <FlatList
          ref={list}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ gap: 10, paddingVertical: 8 }}
          onContentSizeChange={() => list.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            const me = item.role === 'user';
            return (
              <View style={{ alignItems: me ? 'flex-end' : 'flex-start' }}>
                <GlassCard
                  radius={18}
                  padding={12}
                  borderColor={me ? colors.cyan + '88' : colors.accent + '88'}
                  style={{ maxWidth: '85%' }}
                >
                  <Text style={[styles.who, { color: me ? colors.cyan : colors.accent }]}>{me ? 'YOU' : 'ARCHER'}</Text>
                  <Text style={styles.text}>{item.text}</Text>
                </GlassCard>
              </View>
            );
          }}
          ListFooterComponent={
            orbState === 'thinking' ? <Text style={styles.typing}>Archer is thinking…</Text> : null
          }
        />
        <GlassCard radius={999} padding={0} intensity={45}>
          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              onSubmitEditing={submit}
              placeholder="Message Archer…"
              placeholderTextColor={colors.muted}
              style={styles.input}
              returnKeyType="send"
            />
            <Pressable onPress={submit} style={styles.send}>
              <Ionicons name="arrow-up" size={16} color={colors.bg0} />
            </Pressable>
          </View>
        </GlassCard>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  who: { fontSize: 8, fontWeight: '800', letterSpacing: 1.5, marginBottom: 4 },
  text: { color: colors.text, fontSize: font.body, lineHeight: 20 },
  typing: { color: colors.muted, fontSize: font.small, marginTop: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingLeft: 18, paddingRight: 6, paddingVertical: 6 },
  input: { flex: 1, color: colors.text, fontSize: font.body, paddingVertical: 8 },
  send: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
});
