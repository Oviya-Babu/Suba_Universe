export interface SiteConfig {
  friendName: string;
  fromName: string;
  birthday: {
    month: number;
    day: number;
  };
  candleCount: number;
  meta: {
    title: string;
    description: string;
  };
  blessing: {
    imageAlt: string;
  };
  features: {
    micBlow: boolean;
    sfxDefaultOn: boolean;
    cursorHearts: boolean;
    catFollower: boolean;
    hiddenMessage: boolean;
    unlockDate: boolean;
  };
  theme: {
    primary: string;
    lavender: string;
    lavender50: string;
    violetDeep: string;
    midnight: string;
    iceBlue: string;
    periwinkle: string;
    pink: string;
  };
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  src: string;
  artwork?: string;
  note?: string;
  shortLine?: string;
}

export interface Photo {
  id: string;
  src: string;
  alt: string;
  caption: string;
  date?: string;
  featured?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export interface Video {
  id: string;
  src: string;
  poster?: string;
  title: string;
  caption: string;
  alt: string;
}

export interface Letter {
  greeting: string;
  paragraphs: string[];
  memorySlot?: string;
  closing: string;
  signature: string;
}

export interface Poem {
  id: string;
  titleTa: string;
  titleEn: string;
  linesTa: string[];
  linesEn: string[];
  classicEcho?: string;
  isTamil?: boolean;
}

export interface Penguin {
  id: string;
  variant: 'party-hat' | 'gift' | 'scarf' | 'flower-crown' | 'crown' | 'sleepy';
  name: string;
  message: string;
}

export interface Flower {
  id: string;
  type: 'lavender' | 'tulip' | 'rose' | 'daisy' | 'lily' | 'wildflower';
  label: string;
  color: string;
  message: string;
}

export interface ToleranceLabel {
  min: number;
  label: string;
}

export interface Surprises {
  giftBoxes: string[];
  scratchCards: string[];
  wheel: string[];
  toleranceLabels: ToleranceLabel[];
  insideJokes: { text: string }[];
  timeline: { date: string; text: string }[];
}

export interface Wish {
  heading: string;
  paragraphs: string[];
}

export interface FinalContent {
  heading: string;
  lines: string[];
  signature: string;
  endTitle: string;
  endSubtitle: string;
  hiddenMessage: string;
  buttons: {
    replay: string;
    memories: string;
    letter: string;
  };
}

export type JourneyStage = 'entrance' | 'countdown' | 'cake' | 'blessing' | 'universe';
