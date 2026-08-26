export type Direction = 'up' | 'down' | 'left' | 'right';

export type BookCategory =
  | 'NÁRNIA'
  | 'ALEGORIAS'
  | 'SABEDORIA'
  | 'LENDAS DA FÉ'
  | 'COSMOLOGIA'
  | 'CRIATURAS'
  | 'CURA ESPIRITUAL'
  | 'CÂNTICOS'
  | 'ALIANÇA'
  | 'ESCRITURAS';

export interface Book {
  id: string;
  title: string;
  category: BookCategory;
  color: string;
  icon: string;
  description: string;
  loreSnippet?: string;
  parableTitle: string;
  parableChapter?: string;
  parableStory: string;
  spiritualMoral: string;
  scriptureParallel: string;
  themeTag?: 'Graça' | 'Amor' | 'Sabedoria' | 'Fidelidade' | 'Fé' | 'Perdão' | 'Vigilância' | 'Redenção' | 'Esperança' | 'Paz' | 'Humildade' | 'Providência' | 'Sacrifício' | 'Criação';
  roomOrigin: string;
  isSpecial?: 'living' | 'floating' | 'forbidden' | 'lost' | 'eleanor_key';
  x: number;
  y: number;
  placedInShelfId?: string;
  isOrganized?: boolean;
  hasBeenRead?: boolean;
}

export interface Shelf {
  id: string;
  category: BookCategory;
  roomId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  symbol: string;
  maxCapacity: number;
  placedBookIds: string[];
  color: string;
}

export interface Room {
  id: string;
  name: string;
  subtitle: string;
  width: number;
  height: number;
  colorTheme: string;
  ambientLight: number; // 0 to 1
  walls: Array<{ x: number; y: number; w: number; h: number }>;
  obstacles: Array<{
    id: string;
    type: 'desk' | 'table' | 'counter' | 'carpet' | 'statue' | 'plant' | 'clock' | 'telescope' | 'chain' | 'crystal' | 'window' | 'banner' | 'cauldron' | 'globe' | 'altar' | 'candles';
    x: number;
    y: number;
    w: number;
    h: number;
    color?: string;
    name?: string;
    description?: string;
    interactable?: boolean;
    interactMessage?: string;
    hasSecret?: boolean;
    secretRewardKey?: string;
    secretFound?: boolean;
  }>;
  doors: Array<{
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    targetRoomId: string;
    targetX: number;
    targetY: number;
    locked?: boolean;
    requiredKeyId?: string;
    lockName?: string;
    direction: Direction;
  }>;
  torches: Array<{ x: number; y: number; radius: number; color: string; intensity: number }>;
  starRating?: number;
}

export interface NPC {
  id: string;
  name: string;
  title: string;
  roomId: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  dialogueId: string;
  avatarType: 'eleanor' | 'milo' | 'shadow' | 'enzo';
}

export interface DialogueNode {
  id: string;
  speaker: 'Julia' | 'Eleanor' | 'Milo' | 'Narrador' | 'Livro' | 'Enzo Amorzin da Julia' | string;
  avatar: 'julia' | 'eleanor' | 'milo' | 'book' | 'scroll' | 'enzo' | string;
  text: string;
  mood?: 'curious' | 'mysterious' | 'happy' | 'thoughtful' | 'surprised' | 'worried';
  next?: string;
  action?: {
    type: 'give_key' | 'unlock_quest' | 'monologue' | 'finish_game' | 'sparkle_effect';
    payload?: string;
  };
  options?: Array<{
    text: string;
    nextId: string;
  }>;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  targetCount?: number;
  currentCount?: number;
  rewardText: string;
  status: 'active' | 'completed';
}

export interface Item {
  id: string;
  name: string;
  type: 'key' | 'letter' | 'charm' | 'relic';
  icon: string;
  description: string;
  roomId?: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
  type: 'dust' | 'sparkle' | 'page' | 'magic' | 'star' | 'smoke';
}

export interface LightSource {
  x: number;
  y: number;
  radius: number;
  color: string;
  intensity: number;
  flickerSpeed?: number;
}

export interface GameSaveData {
  version: number;
  timestamp: number;
  playTimeMinutes: number;
  player: {
    x: number;
    y: number;
    roomId: string;
    direction: Direction;
    heldBookId: string | null;
  };
  milo: {
    x: number;
    y: number;
    direction: Direction;
  };
  booksOrganizedIds: string[];
  unlockedDoorsIds: string[];
  inventory: Item[];
  activeQuestId: string;
  completedQuestIds: string[];
  discoveredSecrets: string[];
  readNotes: string[];
  roomStars: Record<string, number>;
  settings: {
    musicVolume: number;
    sfxVolume: number;
    particlesEnabled: boolean;
    zoomLevel: number;
  };
}
