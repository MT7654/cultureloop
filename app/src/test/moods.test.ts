import { describe, expect, it } from "vitest";
import { isMood, moods, moodEditorialNotes } from "../domain/moods";
import {
  defaultProfile,
  demoProfile,
  loadProfile,
  saveProfile,
  validateProfile,
  type ProfileStorage,
} from "../domain/profile";
import { recommend } from "../domain/recommend";
import { events } from "../data/events";

describe("optional atmosphere preference", () => {
  it("keeps existing saved profiles compatible and rejects hostile or unknown values", () => {
    expect(validateProfile(demoProfile).mood).toBeUndefined();
    for (const mood of ["<script>", "__proto__", {}, 3, null, "Romantic"])
      expect(validateProfile({ ...demoProfile, mood }).mood).toBeUndefined();
    expect(isMood("reflective")).toBe(true);
  });
  it("roundtrips all six moods without altering balances or saved experiences", () => {
    const values = new Map<string, string>();
    const storage: ProfileStorage = {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => {
        values.set(key, value);
      },
    };
    for (const mood of moods) {
      const profile = {
        ...demoProfile,
        mood: mood.id,
        savedEventIds: ["fat-kids"],
      };
      expect(saveProfile(profile, storage)).toBe(true);
      expect(loadProfile(storage)).toMatchObject({
        mood: mood.id,
        savedEventIds: ["fat-kids"],
        balanceSGD: 45,
      });
      expect(moodEditorialNotes[mood.id].length).toBeGreaterThan(20);
    }
  });
  it("mood changes presentation without modifying source-based recommendations", () => {
    const baseline = recommend(defaultProfile, events, "2026-10-11");
    for (const mood of moods)
      expect(
        recommend({ ...defaultProfile, mood: mood.id }, events, "2026-10-11"),
      ).toEqual(baseline);
  });
});
