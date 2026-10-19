// Sample headlines. Swap fetchHeadlines() for a real news API
// (NewsAPI, GNews, an RSS-to-JSON proxy, ...) when you are ready.
const SAMPLE = [
  { id: 'h1', source: 'Business', title: 'Markets open higher as tech earnings beat forecasts' },
  { id: 'h2', source: 'AI Today', title: 'New on-device models make voice assistants faster' },
  { id: 'h3', source: 'World', title: 'Global leaders meet to discuss climate agreements' },
  { id: 'h4', source: 'Business', title: 'Startups raise record funding for AI infrastructure' },
];

export async function fetchHeadlines() {
  return SAMPLE;
}
