// Shared mock data and types for the Close prototype.
// In a real build this would be powered by Bluetooth / Nearby Interaction
// (iOS UWB) + a relay server (Supabase / Firebase) for once devices have
// established proximity. We keep everything in-memory here.

import { Brand } from './Colors';

export type VibeTag = {
  id: string;
  label: string;
  emoji: string;
  color: string;
};

// Pinnable "viral" vibe tags people give each other after nights out.
// Keep them playful, not mean — this is the secret sauce.
export const VIBE_TAGS: VibeTag[] = [
  { id: 'menace', label: 'Menace to society', emoji: 'fire', color: Brand.orange },
  { id: 'shotcaller', label: 'Shot caller', emoji: 'glass', color: '#FF5C8A' },
  { id: 'storyteller', label: 'Storyteller', emoji: 'book', color: '#7C5CFF' },
  { id: 'dancefloor', label: 'Dancefloor demon', emoji: 'music', color: '#FF3B30' },
  { id: 'good-listener', label: 'Good listener', emoji: 'headphones', color: Brand.success },
  { id: 'romantic', label: 'Hopeless romantic', emoji: 'heart', color: '#FF66A1' },
  { id: 'philosopher', label: '3am philosopher', emoji: 'lightbulb-o', color: Brand.warning },
  { id: 'plug', label: 'The plug', emoji: 'phone', color: '#34C759' },
  { id: 'mystery', label: 'Mystery man/woman', emoji: 'user-secret', color: '#5856D6' },
  { id: 'glue', label: 'The glue', emoji: 'link', color: Brand.blue },
  { id: 'photographer', label: 'Unofficial photographer', emoji: 'camera', color: '#A1A1AA' },
  { id: 'chaos', label: 'Agent of chaos', emoji: 'bolt', color: '#FFB800' },
];

export type NearbyPerson = {
  id: string;
  name: string;
  age: number;
  role: string;            // "Designer at X", "Barista", etc.
  bio: string;
  distanceLabel: string;   // "Same room", "Next table", "On this block"
  signal: 'bluetooth' | 'nearby' | 'gps';
  photoColor: string;      // gradient seed for placeholder avatar
  photos: string[];        // colors representing photo grid placeholders
  vibeTagIds: string[];
  topVibeId?: string;
  starSign?: string;
  city: string;
  mutualConnections: number;
  // The "rating" — average vibe stars from nights out (1–5).
  nightVibe: number;
  nightsRated: number;
  isHere: boolean;         // present right now
  appearedMinsAgo: number;
  hasWaved?: boolean;
  isConnected?: boolean;
};

export const ME = {
  id: 'me',
  name: 'Jacob Sprake',
  initials: 'JS',
  age: 28,
  role: 'Building things in Milan',
  bio: 'Coffee, parks, late-night espresso. Currently looking for a co-working buddy and someone to do the Navigli loop with.',
  city: 'Milano',
  starSign: 'Cancer',
  photoColors: ['#4A7CFF', '#FF6B35', '#34C759', '#7C5CFF', '#FFB800', '#FF66A1'],
  topVibeIds: ['storyteller', 'good-listener', 'philosopher'],
  stats: {
    peopleMet: 23,
    activeConnections: 5,
    nightsOut: 11,
    avgVibe: 4.6,
  },
};

export const NEARBY_PEOPLE: NearbyPerson[] = [
  {
    id: 'p1',
    name: 'Elena Rossi',
    age: 27,
    role: 'Product designer · Bending Spoons',
    bio: 'Rooftop lover. Always down for an aperitivo if the spritz is real.',
    distanceLabel: 'Same cafe',
    signal: 'bluetooth',
    photoColor: '#FF66A1',
    photos: ['#FF66A1', '#FFB347', '#7C5CFF', '#34C759'],
    vibeTagIds: ['glue', 'photographer', 'storyteller'],
    topVibeId: 'glue',
    starSign: 'Libra',
    city: 'Milano',
    mutualConnections: 2,
    nightVibe: 4.8,
    nightsRated: 7,
    isHere: true,
    appearedMinsAgo: 2,
    isConnected: true,
  },
  {
    id: 'p2',
    name: 'Marco Bianchi',
    age: 31,
    role: 'Backend engineer · Satispay',
    bio: 'Bouldering, vinyl, and overpriced coffee. Will judge your espresso.',
    distanceLabel: 'Next table',
    signal: 'bluetooth',
    photoColor: '#4A7CFF',
    photos: ['#4A7CFF', '#0D1117', '#34C759'],
    vibeTagIds: ['philosopher', 'good-listener'],
    topVibeId: 'philosopher',
    starSign: 'Capricorn',
    city: 'Milano',
    mutualConnections: 1,
    nightVibe: 4.4,
    nightsRated: 4,
    isHere: true,
    appearedMinsAgo: 6,
  },
  {
    id: 'p3',
    name: 'Sofia Conti',
    age: 25,
    role: 'Photographer · freelance',
    bio: 'Film over digital. Looking for shoot collabs in Milan & Como.',
    distanceLabel: 'On this block',
    signal: 'nearby',
    photoColor: '#7C5CFF',
    photos: ['#7C5CFF', '#FF66A1', '#FFB347', '#34C759', '#4A7CFF'],
    vibeTagIds: ['photographer', 'mystery', 'romantic'],
    topVibeId: 'photographer',
    starSign: 'Pisces',
    city: 'Milano',
    mutualConnections: 4,
    nightVibe: 4.9,
    nightsRated: 9,
    isHere: true,
    appearedMinsAgo: 14,
  },
  {
    id: 'p4',
    name: 'Luca Moretti',
    age: 29,
    role: 'DJ · Apollo Club',
    bio: 'If you hear deep house at 2am, that’s probably me. Bring earplugs.',
    distanceLabel: 'Around the corner',
    signal: 'gps',
    photoColor: '#FF3B30',
    photos: ['#FF3B30', '#0D1117', '#7C5CFF'],
    vibeTagIds: ['dancefloor', 'shotcaller', 'chaos'],
    topVibeId: 'dancefloor',
    starSign: 'Leo',
    city: 'Milano',
    mutualConnections: 3,
    nightVibe: 4.7,
    nightsRated: 12,
    isHere: false,
    appearedMinsAgo: 45,
    isConnected: true,
  },
  {
    id: 'p5',
    name: 'Chiara Lombardi',
    age: 26,
    role: 'PM · Iliad',
    bio: 'Half-marathon training. Weekday spritz, weekend hikes.',
    distanceLabel: 'Same building',
    signal: 'bluetooth',
    photoColor: '#34C759',
    photos: ['#34C759', '#4A7CFF', '#FFB347'],
    vibeTagIds: ['good-listener', 'plug'],
    topVibeId: 'plug',
    starSign: 'Virgo',
    city: 'Milano',
    mutualConnections: 0,
    nightVibe: 4.2,
    nightsRated: 3,
    isHere: true,
    appearedMinsAgo: 23,
  },
  {
    id: 'p6',
    name: 'Tomas Becker',
    age: 30,
    role: 'Founder · stealth',
    bio: 'Berlin → Milan. Looking for a co-founder for something annoyingly simple.',
    distanceLabel: 'Nearby block',
    signal: 'nearby',
    photoColor: '#0D1117',
    photos: ['#0D1117', '#4A7CFF', '#FF6B35'],
    vibeTagIds: ['storyteller', 'menace', 'shotcaller'],
    topVibeId: 'menace',
    starSign: 'Scorpio',
    city: 'Milano',
    mutualConnections: 1,
    nightVibe: 4.5,
    nightsRated: 5,
    isHere: false,
    appearedMinsAgo: 90,
  },
];

export type Plan = {
  id: string;
  emoji: string;
  title: string;
  spot: string;
  neighborhood: string;
  startsAt: string;        // human label
  hostId: string;
  goingIds: string[];
  maybeIds: string[];
  capacity: number;
  vibe: 'chill' | 'rowdy' | 'classy' | 'random';
  description: string;
};

export const PLANS: Plan[] = [
  {
    id: 'pl1',
    emoji: '🍸',
    title: 'Spritz crawl through Brera',
    spot: 'Bar Basso → N’Ombra de Vin → Mag',
    neighborhood: 'Brera',
    startsAt: 'Tonight, 7:30pm',
    hostId: 'p1',
    goingIds: ['p1', 'p3', 'p5', 'me'],
    maybeIds: ['p2'],
    capacity: 8,
    vibe: 'classy',
    description: 'Three stops, one Negroni each, finish before the line at Mag.',
  },
  {
    id: 'pl2',
    emoji: '🎧',
    title: 'Apollo Club — house till sunrise',
    spot: 'Apollo Club',
    neighborhood: 'Porta Romana',
    startsAt: 'Saturday, 11pm',
    hostId: 'p4',
    goingIds: ['p4', 'p3', 'p6'],
    maybeIds: ['p1', 'p2', 'me'],
    capacity: 12,
    vibe: 'rowdy',
    description: 'Guestlist closes at 10. DM Luca for +1.',
  },
  {
    id: 'pl3',
    emoji: '🏃',
    title: 'Sunrise run — Parco Sempione',
    spot: 'Arco della Pace',
    neighborhood: 'Sempione',
    startsAt: 'Sunday, 7am',
    hostId: 'p5',
    goingIds: ['p5', 'p2'],
    maybeIds: ['p6'],
    capacity: 10,
    vibe: 'chill',
    description: '5K loop, coffee at Pavé after. Bring a friend.',
  },
  {
    id: 'pl4',
    emoji: '🍝',
    title: 'Underground supper club',
    spot: 'Address shared 1h before',
    neighborhood: 'Isola',
    startsAt: 'Friday, 9pm',
    hostId: 'p6',
    goingIds: ['p6', 'p1'],
    maybeIds: ['p3', 'p5'],
    capacity: 6,
    vibe: 'classy',
    description: 'Pasta + natural wine. €40 share. Vegetarians welcome.',
  },
];

export type ChatMessage = {
  id: string;
  authorId: string;
  text: string;
  timeAgo: string;
  reactions?: { emoji: string; count: number }[];
  pinned?: boolean;
};

export const CITY_CHAT: ChatMessage[] = [
  {
    id: 'm1',
    authorId: 'p1',
    text: 'who’s out tonight in Brera? 4 of us at Bar Basso 🍸',
    timeAgo: '2m',
    reactions: [{ emoji: '🙋', count: 6 }, { emoji: '🍸', count: 4 }],
  },
  {
    id: 'm2',
    authorId: 'p4',
    text: 'plus one for Apollo Sat — DM',
    timeAgo: '8m',
    reactions: [{ emoji: '🎧', count: 11 }],
  },
  {
    id: 'm3',
    authorId: 'p3',
    text: 'looking for a film camera buddy for a Navigli walk this weekend',
    timeAgo: '21m',
    reactions: [{ emoji: '📸', count: 5 }],
  },
  {
    id: 'm4',
    authorId: 'p6',
    text: 'underground supper club Friday — 2 spots left, comment to claim',
    timeAgo: '1h',
    reactions: [{ emoji: '🍝', count: 9 }, { emoji: '🔥', count: 3 }],
    pinned: true,
  },
  {
    id: 'm5',
    authorId: 'p2',
    text: 'best espresso in Porta Venezia, go',
    timeAgo: '2h',
    reactions: [{ emoji: '☕', count: 14 }],
  },
];

export type RatingPin = {
  id: string;
  authorId: string;
  targetId: string;
  vibeTagId: string;
  note?: string;
  date: string;
};

export const RATING_PINS_FOR_ME: RatingPin[] = [
  { id: 'r1', authorId: 'p1', targetId: 'me', vibeTagId: 'storyteller', note: 'told the bouncer story 3 times. still funny.', date: 'Mar 24' },
  { id: 'r2', authorId: 'p4', targetId: 'me', vibeTagId: 'good-listener', date: 'Mar 18' },
  { id: 'r3', authorId: 'p3', targetId: 'me', vibeTagId: 'philosopher', note: 'gave a 12 minute monologue on stoicism at 2am, somehow it slapped', date: 'Mar 11' },
];

export type Hotspot = {
  id: string;
  name: string;
  encounters: number;
  trend: 'up' | 'down' | 'same';
  x: number;
  y: number;
  radius: number;
  intensity: number;
};

export const HOTSPOTS: Hotspot[] = [
  { id: 'h1', name: 'Bar Basso',         encounters: 18, trend: 'up',   x: 45, y: 30, radius: 56, intensity: 1.0 },
  { id: 'h2', name: 'Apollo Club',       encounters: 14, trend: 'up',   x: 70, y: 60, radius: 48, intensity: 0.85 },
  { id: 'h3', name: 'Parco Sempione',    encounters: 11, trend: 'same', x: 22, y: 38, radius: 60, intensity: 0.7 },
  { id: 'h4', name: 'Navigli',           encounters: 9,  trend: 'down', x: 55, y: 78, radius: 42, intensity: 0.55 },
  { id: 'h5', name: 'Pavé Café',         encounters: 7,  trend: 'up',   x: 35, y: 55, radius: 34, intensity: 0.45 },
  { id: 'h6', name: 'WeWork Sempione',   encounters: 6,  trend: 'same', x: 78, y: 28, radius: 30, intensity: 0.4 },
];

export function getPersonById(id: string): NearbyPerson | undefined {
  return NEARBY_PEOPLE.find((p) => p.id === id);
}

export function getVibeTag(id: string): VibeTag | undefined {
  return VIBE_TAGS.find((v) => v.id === id);
}
