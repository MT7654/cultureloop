import type { Mood } from "./types";

/** Mood describes the listener's atmosphere, never an unverified claim about an event. */
export const moods: {
  id: Mood;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    id: "intimate",
    label: "Intimate",
    description: "A little closer",
    color: "#ffba98",
  },
  {
    id: "energetic",
    label: "Energetic",
    description: "Turn up your curiosity",
    color: "#d6ff75",
  },
  {
    id: "reflective",
    label: "Reflective",
    description: "Room to wander",
    color: "#9dc6ff",
  },
  {
    id: "playful",
    label: "Playful",
    description: "Follow the unexpected",
    color: "#e7a3ff",
  },
  {
    id: "romantic",
    label: "Romantic",
    description: "Something to share",
    color: "#ff91ae",
  },
  {
    id: "experimental",
    label: "Experimental",
    description: "A different frequency",
    color: "#8befd8",
  },
];

export const moodEditorialNotes: Record<Mood, string> = {
  intimate:
    "A closer listening lens. Take your time with the stories behind these connections.",
  energetic:
    "A brighter discovery lens. Follow the connections that spark your curiosity.",
  reflective:
    "A slower discovery lens. Leave a little room for a connection you weren't expecting.",
  playful:
    "A playful discovery lens. Try a different cluster and see where your tastes take you.",
  romantic:
    "A shared discovery lens. Explore a connection you might want to experience together.",
  experimental:
    "An exploratory discovery lens. Listen beyond the familiar and follow a new thread.",
};

export function isMood(value: unknown): value is Mood {
  return typeof value === "string" && moods.some((mood) => mood.id === value);
}
