// Archer's brain. Uses the Anthropic Messages API when an API key is set in
// Settings; otherwise falls back to a small offline responder so the app
// is fully usable out of the box.

const TONES = {
  friendly: 'Warm, upbeat and conversational.',
  professional: 'Polished, precise and businesslike.',
  witty: 'Playful with light, tasteful humor.',
};
const LENGTHS = {
  short: 'Keep replies to 1-2 short sentences.',
  medium: 'Keep replies to a short paragraph.',
  long: 'Give thorough, well-structured answers.',
};

export function buildSystemPrompt({ soul, memory }) {
  const mem = memory.length
    ? '\nThings you remember about the user:\n' + memory.map((m) => `- ${m.text}`).join('\n')
    : '';
  return (
    `You are ${soul.name}, a voice-first personal AI assistant inside a mobile app. ` +
    `${TONES[soul.tone] || TONES.friendly} ${LENGTHS[soul.length] || LENGTHS.short} ` +
    `Reply in the same language the user writes in. Avoid markdown; your answers may be read aloud.` +
    mem
  );
}

function offlineReply(text, { soul, memory, tasks }) {
  const t = text.toLowerCase();
  if (/^(hi|hello|hey)\b/.test(t)) return `Hello! I'm ${soul.name}. What can I do for you?`;
  if (t.includes('time')) return `It's ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
  if (t.includes('date') || t.includes('today')) return `Today is ${new Date().toDateString()}.`;
  if (t.includes('task')) {
    const open = tasks.filter((x) => !x.done);
    return open.length ? `You have ${open.length} open tasks. First up: ${open[0].text}.` : 'You have no open tasks. Nice!';
  }
  if (t.includes('memory') || t.includes('remember what')) {
    return memory.length ? `I remember: ${memory.slice(0, 3).map((m) => m.text).join('; ')}.` : "I don't have any memories saved yet. Say 'remember' followed by a note.";
  }
  return "I'm running in offline mode. Add your API key in Settings and I can answer anything.";
}

export async function askArcher({ history, settings, soul, memory, tasks }) {
  const last = history[history.length - 1]?.text || '';
  if (!settings.apiKey) {
    await new Promise((r) => setTimeout(r, 600));
    return offlineReply(last, { soul, memory, tasks });
  }

  // API requires alternating roles starting with "user".
  let msgs = history.slice(-12).map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }));
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': settings.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: settings.model,
      max_tokens: 600,
      system: buildSystemPrompt({ soul, memory }),
      messages: msgs,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body.slice(0, 160)}`);
  }
  const data = await res.json();
  return (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim() || '...';
}
