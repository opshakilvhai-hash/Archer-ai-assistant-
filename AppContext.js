import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { askArcher } from '../services/ai';

const KEY = 'archer:v1';
const uid = () => Math.random().toString(36).slice(2, 10);

const DEFAULTS = {
  messages: [{ id: 'm0', role: 'archer', text: "Hi, I'm Archer. How can I help?" }],
  memory: [],
  tasks: [
    { id: 't1', text: 'Release desktop version', done: false },
    { id: 't2', text: 'Upload video to TikTok', done: false },
  ],
  settings: { apiKey: '', model: 'claude-sonnet-5-5', voice: true, rate: 1 },
  soul: { name: 'Archer', tone: 'friendly', length: 'short' },
};

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [loaded, setLoaded] = useState(false);
  const [messages, setMessages] = useState(DEFAULTS.messages);
  const [memory, setMemory] = useState(DEFAULTS.memory);
  const [tasks, setTasks] = useState(DEFAULTS.tasks);
  const [settings, setSettings] = useState(DEFAULTS.settings);
  const [soul, setSoul] = useState(DEFAULTS.soul);
  const [orbState, setOrbState] = useState('idle');
  const [error, setError] = useState(null);

  // Load
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const d = JSON.parse(raw);
          d.messages && setMessages(d.messages);
          d.memory && setMemory(d.memory);
          d.tasks && setTasks(d.tasks);
          d.settings && setSettings({ ...DEFAULTS.settings, ...d.settings });
          d.soul && setSoul({ ...DEFAULTS.soul, ...d.soul });
        }
      } catch (e) {
        console.warn('load failed', e);
      }
      setLoaded(true);
    })();
  }, []);

  // Save
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(
      KEY,
      JSON.stringify({ messages: messages.slice(-100), memory, tasks, settings, soul })
    ).catch(() => {});
  }, [loaded, messages, memory, tasks, settings, soul]);

  const live = useRef({});
  live.current = { messages, memory, tasks, settings, soul };

  const stop = useCallback(() => {
    Speech.stop();
    setOrbState('idle');
  }, []);

  const speak = useCallback((text) => {
    const { settings: s } = live.current;
    if (!s.voice) return setOrbState('idle');
    Speech.stop();
    Speech.speak(text, {
      rate: s.rate,
      onStart: () => setOrbState('speaking'),
      onDone: () => setOrbState('idle'),
      onStopped: () => setOrbState('idle'),
      onError: () => setOrbState('idle'),
    });
  }, []);

  const addMessage = (role, text) => setMessages((m) => [...m, { id: uid(), role, text }]);

  const addMemory = useCallback((text) => setMemory((m) => [{ id: uid(), text, at: Date.now() }, ...m]), []);
  const removeMemory = useCallback((id) => setMemory((m) => m.filter((x) => x.id !== id)), []);

  const addTask = useCallback((text) => setTasks((t) => [...t, { id: uid(), text, done: false }]), []);
  const toggleTask = useCallback((id) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x))), []);
  const removeTask = useCallback((id) => setTasks((t) => t.filter((x) => x.id !== id)), []);

  const sendMessage = useCallback(
    async (raw) => {
      const text = raw.trim();
      if (!text) return;
      setError(null);
      addMessage('user', text);

      const rem = text.match(/^remember[:,]?\s+(.+)/i);
      if (rem) {
        addMemory(rem[1]);
        const reply = 'Got it. Saved to memory.';
        addMessage('archer', reply);
        speak(reply);
        return;
      }

      setOrbState('thinking');
      try {
        const cur = live.current;
        const history = [...cur.messages, { role: 'user', text }];
        const reply = await askArcher({ history, settings: cur.settings, soul: cur.soul, memory: cur.memory, tasks: cur.tasks });
        addMessage('archer', reply);
        speak(reply);
      } catch (e) {
        setError(e.message);
        addMessage('archer', 'Sorry, something went wrong. Check your connection and API key in Settings.');
        setOrbState('idle');
      }
    },
    [speak, addMemory]
  );

  const clearChat = useCallback(() => setMessages(DEFAULTS.messages), []);
  const resetAll = useCallback(async () => {
    Speech.stop();
    await AsyncStorage.removeItem(KEY);
    setMessages(DEFAULTS.messages);
    setMemory([]);
    setTasks(DEFAULTS.tasks);
    setSettings(DEFAULTS.settings);
    setSoul(DEFAULTS.soul);
    setOrbState('idle');
  }, []);

  const value = {
    loaded, messages, memory, tasks, settings, soul, orbState, error,
    setOrbState, setSettings, setSoul,
    sendMessage, stop, clearChat, resetAll,
    addMemory, removeMemory, addTask, toggleTask, removeTask,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
