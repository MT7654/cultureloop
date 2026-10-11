import {
  interestLabels,
  type Category,
  type CultureProfile,
  type Interest,
  type Occasion,
} from "./types";
import { isMood } from "./moods";

export const defaultProfile: CultureProfile = {
  balanceSGD: 100,
  previousHighlights: [],
  interests: [],
  nextOccasion: "flexible",
  timingPreference: "any",
  savedEventIds: [],
  selfReportedAttendance: [],
  journeyNotes: {},
};
export const demoProfile: CultureProfile = {
  ...defaultProfile,
  balanceSGD: 45,
  previousCategory: "theatre",
  previousTitle: "A musical on a date",
  previousSentiment: "loved",
  previousHighlights: ["music", "story"],
  previousOccasion: "date",
  interests: ["indie", "film", "theatre"],
  nextOccasion: "date",
};

export const STORAGE_KEY = "cultureloop:v1";
const categories: Category[] = [
  "music",
  "theatre",
  "heritage",
  "visual-arts",
  "workshop",
  "film",
  "literature",
  "other",
];
const occasions: Occasion[] = ["date", "friends", "family", "solo", "flexible"];
const strings = (input: unknown, max = 100) =>
  Array.isArray(input)
    ? [
        ...new Set(
          input
            .filter((s): s is string => typeof s === "string")
            .map((s) => s.slice(0, 160)),
        ),
      ].slice(0, max)
    : [];
const date = (input: unknown) =>
  typeof input === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(input) &&
  !Number.isNaN(Date.parse(input)) &&
  new Date(input).toISOString().slice(0, 10) === input
    ? input
    : undefined;

/** Treat localStorage as untrusted input. Text is plain text, never an HTML payload. */
export function validateProfile(input: unknown): CultureProfile {
  const data =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};
  const balance =
    typeof data.balanceSGD === "number" && Number.isFinite(data.balanceSGD)
      ? data.balanceSGD
      : 100;
  const previousCategory = categories.includes(
    data.previousCategory as Category,
  )
    ? (data.previousCategory as Category)
    : undefined;
  const previousSentiment = ["loved", "okay", "not-for-me"].includes(
    data.previousSentiment as string,
  )
    ? (data.previousSentiment as CultureProfile["previousSentiment"])
    : undefined;
  return {
    balanceSGD: Math.min(100, Math.max(0, balance)),
    acceptedMemorySummary: typeof data.acceptedMemorySummary === "string"
      ? data.acceptedMemorySummary.replace(/[<>\u0000-\u001f]/g, "").slice(0, 240)
      : undefined,
    journeyNotes: data.journeyNotes && typeof data.journeyNotes === "object" && !Array.isArray(data.journeyNotes)
      ? Object.fromEntries(Object.entries(data.journeyNotes).filter(([id, entry]) =>
          /^[a-z0-9-]{1,100}$/.test(id) && entry && typeof entry === "object"
        ).slice(0, 100).map(([id, entry]) => {
          const intent = entry as Record<string, unknown>;
          const clean = (value: unknown, max: number) => typeof value === "string" ? value.replace(/[<>\u0000-\u001f]/g, "").slice(0, max) : "";
          return [id, { reason: clean(intent.reason, 80), note: clean(intent.note, 280) }];
        })) : {},
    mood: isMood(data.mood) ? data.mood : undefined,
    previousCategory,
    previousTitle:
      typeof data.previousTitle === "string"
        ? data.previousTitle.replace(/[<>\u0000-\u001f]/g, "").slice(0, 160)
        : undefined,
    previousSentiment,
    previousHighlights: strings(data.previousHighlights, 2),
    previousOccasion: occasions.includes(data.previousOccasion as Occasion)
      ? (data.previousOccasion as Occasion)
      : undefined,
    interests: strings(data.interests, 5).filter((s): s is Interest =>
      Object.hasOwn(interestLabels, s),
    ),
    nextOccasion: occasions.includes(data.nextOccasion as Occasion)
      ? (data.nextOccasion as Occasion)
      : "flexible",
    timingPreference: ["any", "weekday-evening", "weekend"].includes(
      data.timingPreference as string,
    )
      ? (data.timingPreference as CultureProfile["timingPreference"])
      : "any",
    savedEventIds: strings(data.savedEventIds),
    selfReportedAttendance: strings(data.selfReportedAttendance),
    surpriseMe: data.surpriseMe === true,
    dateFrom: date(data.dateFrom),
    dateTo: date(data.dateTo),
  };
}

export interface ProfileStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export function loadProfile(storage?: ProfileStorage): CultureProfile {
  try {
    const target = storage ?? globalThis.localStorage;
    const raw = target.getItem(STORAGE_KEY);
    return validateProfile(raw ? JSON.parse(raw) : defaultProfile);
  } catch {
    return validateProfile(defaultProfile);
  }
}
export function saveProfile(
  profile: CultureProfile,
  storage?: ProfileStorage,
): boolean {
  try {
    (storage ?? globalThis.localStorage).setItem(
      STORAGE_KEY,
      JSON.stringify(validateProfile(profile)),
    );
    return true;
  } catch {
    return false;
  }
}
