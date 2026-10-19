# Archer AI

A voice-first AI assistant app with a glassmorphism UI, built with Expo + React Native.
The layout follows the Archer AI screen recording: transcript card, animated orb with
Memory / Chat / Soul / Settings pills, headlines and a task list.

## Run it
```bash
npm install
npx expo start
```
Scan the QR code with Expo Go (SDK 52) or press `a` / `i` for an emulator.

## Features
- Glass panels (blur + gradient + hairline border) over an animated glow background
- Animated particle orb with idle / listening / thinking / speaking states
- Chat with spoken replies (expo-speech); the STOP button cuts speech
- Memory: say "remember ..." in chat, or add notes and tasks manually
- Soul: rename Archer, pick personality and reply length
- Settings: API key, model, voice on/off, speech rate, data reset
- Works offline with simple built-in replies; add an Anthropic API key in Settings for real answers
- Everything persists locally with AsyncStorage

## Structure
```
App.js                      navigation + providers
src/theme.js                colors and sizes
src/context/AppContext.js   state, persistence, speech, send logic
src/services/ai.js          Anthropic call + offline fallback
src/services/headlines.js   headlines source (sample data, swap for a real API)
src/components/             GlassCard, Background, Orb, NavPill, ScreenShell
src/screens/                Home, Chat, Memory, Soul, Settings
```

## Notes
- Android blur uses `experimentalBlurMethod="dimezisBlurView"` (expo-blur 14). If a device renders it poorly, remove that prop from GlassCard/NavPill.
- Production apps should call the AI API through your own backend rather than storing a key on the device.
- Voice input (speech-to-text) needs a dev build with a native module such as `@react-native-voice/voice`; wire its result into `sendMessage`.
