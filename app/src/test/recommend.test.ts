import { describe, expect, it } from "vitest";
import { events } from "../data/events";
import { budget } from "../domain/budget";
import {
  demoProfile,
  defaultProfile,
  loadProfile,
  saveProfile,
  STORAGE_KEY,
  validateProfile,
  type ProfileStorage,
} from "../domain/profile";
import { isEligible, recommend, singaporeToday } from "../domain/recommend";
import type { CultureEvent } from "../domain/types";

const today = "2026-10-11";
const fixture = (values: Partial<CultureEvent> = {}): CultureEvent => ({
  ...events[0],
  ...values,
});

describe("one-ticket base-price estimates", () => {
  it("applies full price when within manual credits", () =>
    expect(budget(45, 35)).toEqual({ creditApplied: 35, cashTopUp: 0 }));
  it("shows the exact base-price top-up", () =>
    expect(budget(45, 78)).toEqual({ creditApplied: 45, cashTopUp: 33 }));
  it("keeps unknown pricing unknown", () =>
    expect(budget(45, null)).toEqual({ creditApplied: null, cashTopUp: null }));
  it("handles zero balance, zero price and invalid balance without NaN", () => {
    expect(budget(0, 18)).toEqual({ creditApplied: 0, cashTopUp: 18 });
    expect(budget(0, 0)).toEqual({ creditApplied: 0, cashTopUp: 0 });
    expect(budget(Number.NaN, 18)).toEqual({ creditApplied: 0, cashTopUp: 18 });
  });
});

describe("verified and date-relevant eligibility", () => {
  it("keeps a last-day event through Singapore local date", () =>
    expect(
      isEligible(fixture({ endDate: today, startDate: today }), today),
    ).toBe(true));
  it("excludes expired, illustrative, missing metadata and unsafe links", () => {
    expect(isEligible(fixture({ endDate: "2026-10-10" }), today)).toBe(false);
    expect(
      isEligible(fixture({ verificationStatus: "unverified_demo" }), today),
    ).toBe(false);
    expect(isEligible(fixture({ title: "" }), today)).toBe(false);
    expect(isEligible(fixture({ endDate: undefined }), today)).toBe(false);
    expect(
      isEligible(
        fixture({ startDate: "2026-02-30", endDate: "2026-12-31" }),
        today,
      ),
    ).toBe(false);
    expect(
      isEligible(
        fixture({
          officialListingUrl: "https://www.sistic.com.sg.attacker.test/event/1",
        }),
        today,
      ),
    ).toBe(false);
    expect(isEligible(fixture({ availability: "sold-out" }), today)).toBe(
      false,
    );
    expect(isEligible(fixture({ startingPriceSGD: Number.NaN }), today)).toBe(
      false,
    );
  });
  it("uses Singapore day boundaries regardless of host timezone", () => {
    expect(singaporeToday(new Date("2026-10-10T16:01:00Z"))).toBe("2026-10-11");
    expect(singaporeToday(new Date("2026-10-10T15:59:00Z"))).toBe("2026-10-10");
  });
  it("only returns verified catalogue entries, never implies tickets are available", () => {
    const result = recommend(demoProfile, events, today);
    expect(result).toHaveLength(3);
    expect(
      result.every(
        (item) =>
          item.event.verificationStatus === "verified_eligible" &&
          item.event.availability === "unknown",
      ),
    ).toBe(true);
    expect(result.map((item) => item.explanation).join(" ")).not.toMatch(
      /tickets? (available|guaranteed)|selling fast|redeemed/i,
    );
  });
});

describe("transparent personalised recommendations", () => {
  it("returns a supported bridge and category variety for the demo", () => {
    const result = recommend(demoProfile, events, today);
    expect(
      result.some(
        (item) =>
          item.bridge &&
          item.matchedTags.some((tag) => item.event.bridgeExplanations[tag]),
      ),
    ).toBe(true);
    expect(
      new Set(result.map((item) => item.event.category)).size,
    ).toBeGreaterThanOrEqual(2);
    expect(
      result.some(
        (item) => item.event.category === demoProfile.previousCategory,
      ),
    ).toBe(true);
    for (const item of result) {
      expect(item.score).toBeGreaterThanOrEqual(0);
      expect(item.score).toBeLessThanOrEqual(100);
      expect(item.explanation.length).toBeGreaterThan(30);
    }
  });
  it("is stable for fixed inputs and does not mutate balance or events", () => {
    const profile = structuredClone(demoProfile);
    const catalogue = structuredClone(events);
    const before = JSON.stringify({ profile, catalogue });
    expect(recommend(profile, catalogue, today)).toEqual(
      recommend(profile, catalogue, today),
    );
    expect(JSON.stringify({ profile, catalogue })).toBe(before);
  });
  it("changes affordability score as balance changes", () => {
    const low = recommend(
      { ...demoProfile, balanceSGD: 0 },
      [events[3]],
      today,
    )[0];
    const full = recommend(
      { ...demoProfile, balanceSGD: 100 },
      [events[3]],
      today,
    )[0];
    expect(low.breakdown.budget).toBe(0);
    expect(full.breakdown.budget).toBe(15);
    expect(full.score).toBeGreaterThan(low.score);
  });
  it("avoids disliked category unless user explicitly asks for it", () => {
    const profile = {
      ...defaultProfile,
      previousCategory: "theatre" as const,
      previousSentiment: "not-for-me" as const,
    };
    expect(
      recommend(profile, events, today).some(
        (item) => item.event.category === "theatre",
      ),
    ).toBe(false);
    expect(
      recommend({ ...profile, interests: ["theatre"] }, [events[0]], today),
    ).toHaveLength(1);
  });
  it("handles no preferences and fully expired catalogues honestly", () => {
    expect(recommend(defaultProfile, events, today)).toHaveLength(3);
    expect(recommend(defaultProfile, [], today)).toEqual([]);
    expect(recommend(defaultProfile, events, "2099-01-01")).toEqual([]);
  });
  it("applies date-range overlap without guessing weekday session schedules", () => {
    const result = recommend(
      {
        ...defaultProfile,
        dateFrom: "2026-12-05",
        dateTo: "2026-12-06",
        timingPreference: "weekday-evening",
      },
      events.slice(0, 7),
      today,
    );
    expect(result.map((item) => item.event.id).sort()).toEqual([
      "comic-con",
      "under-one-roof",
    ]);
  });
});

describe("safe recoverable local persistence", () => {
  const memory = (): ProfileStorage => {
    const values = new Map<string, string>();
    return {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => {
        values.set(key, value);
      },
    };
  };
  it("restores saved IDs without deducting credits", () => {
    const storage = memory();
    expect(
      saveProfile({ ...demoProfile, savedEventIds: ["fat-kids"] }, storage),
    ).toBe(true);
    expect(loadProfile(storage).savedEventIds).toEqual(["fat-kids"]);
    expect(loadProfile(storage).balanceSGD).toBe(45);
  });
  it("recovers corrupt JSON and unavailable storage", () => {
    const storage = memory();
    storage.setItem(STORAGE_KEY, "{broken");
    expect(loadProfile(storage).balanceSGD).toBe(100);
    const unavailable = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("quota");
      },
    };
    expect(loadProfile(unavailable).interests).toEqual([]);
    expect(saveProfile(demoProfile, unavailable)).toBe(false);
  });
  it("validates user state, caps text and strips executable markup delimiters", () => {
    const result = validateProfile({
      balanceSGD: 999,
      previousTitle: "<img src=x onerror=alert(1)>",
      interests: ["indie", "__proto__", "indie"],
      nextOccasion: "nonsense",
      savedEventIds: ["a", "a"],
    });
    expect(result.balanceSGD).toBe(100);
    expect(result.previousTitle).not.toContain("<");
    expect(result.previousTitle).not.toContain(">");
    expect(result.interests).toEqual(["indie"]);
    expect(result.nextOccasion).toBe("flexible");
    expect(result.savedEventIds).toEqual(["a"]);
  });
});
