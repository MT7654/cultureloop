import type { Interest } from "./types";

export type MusicInterest =
  "indie" | "jazz" | "electronic" | "pop" | "orchestral";

export interface SoundLayer {
  id: MusicInterest | "ambient";
  label: string;
  chord: readonly number[];
  melody: readonly number[];
  /** Beat positions in an eight-tick phrase, permitting syncopated jazz. */
  beats: readonly number[];
  melodyWave: OscillatorType;
  tone: number;
  padLength: number;
  pulse: boolean;
  weight: number;
}

export interface SoundProfile {
  key: string;
  title: string;
  description: string;
  musicInterests: MusicInterest[];
  layers: SoundLayer[];
  tone: number;
}

// All compositions share A minor, so genre layers can coexist musically.
// These are original interpretations of selected tastes, never event recordings.
const compositions: Record<
  MusicInterest | "ambient",
  Omit<SoundLayer, "weight">
> = {
  indie: {
    id: "indie",
    label: "Indie",
    chord: [45, 52, 57, 60],
    melody: [64, 60, 62, 57, 60, 64],
    beats: [0, 4],
    melodyWave: "triangle",
    tone: 1500,
    padLength: 8.7,
    pulse: false,
  },
  jazz: {
    id: "jazz",
    label: "Jazz",
    chord: [45, 52, 55, 59],
    melody: [64, 67, 71, 69, 67, 62],
    beats: [0, 3, 6],
    melodyWave: "sine",
    tone: 1900,
    padLength: 8.7,
    pulse: false,
  },
  electronic: {
    id: "electronic",
    label: "Electronic",
    chord: [45, 52, 57, 64],
    melody: [69, 76, 72, 76, 69, 64],
    beats: [0, 2, 4, 6],
    melodyWave: "triangle",
    tone: 2900,
    padLength: 8.7,
    pulse: true,
  },
  pop: {
    id: "pop",
    label: "Pop",
    chord: [45, 52, 60, 64],
    melody: [69, 72, 76, 72, 69, 67],
    beats: [0, 2, 4],
    melodyWave: "triangle",
    tone: 2400,
    padLength: 8.7,
    pulse: true,
  },
  orchestral: {
    id: "orchestral",
    label: "Orchestral",
    chord: [45, 52, 60, 64],
    melody: [64, 67, 69, 72, 69, 64],
    beats: [0, 5],
    melodyWave: "sine",
    tone: 1100,
    padLength: 8.7,
    pulse: false,
  },
  ambient: {
    id: "ambient",
    label: "Ambient",
    chord: [45, 52, 55, 59],
    melody: [64, 62, 59, 55, 59, 62],
    beats: [0, 5],
    melodyWave: "sine",
    tone: 1000,
    padLength: 8.7,
    pulse: false,
  },
};

const musicOrder: MusicInterest[] = [
  "indie",
  "jazz",
  "electronic",
  "pop",
  "orchestral",
];

/** Selection order and duplicate selections never change the resulting mix. */
export function deriveSoundProfile(
  interests: readonly Interest[],
): SoundProfile {
  const selected = new Set(interests);
  const musicInterests = musicOrder.filter((interest) =>
    selected.has(interest),
  );
  const ids: (MusicInterest | "ambient")[] = musicInterests.length
    ? musicInterests
    : ["ambient"];
  const layers = ids.map((id) => ({
    ...compositions[id],
    weight: 1 / ids.length,
  }));
  return {
    key: ids.join("+"),
    title: musicInterests.length ? "Your mix" : "CultureLoop ambient",
    description: musicInterests.length
      ? layers.map((layer) => layer.label).join(" + ")
      : "Original ambient soundscape",
    musicInterests,
    layers,
    tone: layers.reduce((sum, layer) => sum + layer.tone * layer.weight, 0),
  };
}
