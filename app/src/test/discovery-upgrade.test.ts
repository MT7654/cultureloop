import { describe, it, expect } from "vitest";
import { events } from "../data/events";
import { defaultProfile, validateProfile } from "../domain/profile";
import { recommend, rankRecommendations, nextConnection, isEligible } from "../domain/recommend";
import type { CultureProfile } from "../domain/types";

const today = "2026-10-11";
const profiles: CultureProfile[] = [
  { ...defaultProfile, interests:["indie","film"], balanceSGD:45, nextOccasion:"date", previousCategory:"theatre", previousSentiment:"loved", previousHighlights:["story"] },
  { ...defaultProfile, interests:["jazz","orchestral"], balanceSGD:100, nextOccasion:"solo" },
  { ...defaultProfile, interests:["art","workshop"], balanceSGD:20, nextOccasion:"friends" },
  { ...defaultProfile, interests:["heritage"], balanceSGD:45, nextOccasion:"family" },
  { ...defaultProfile, interests:["film","literature"], balanceSGD:100, nextOccasion:"solo" },
  { ...defaultProfile, interests:["electronic","pop"], balanceSGD:45, nextOccasion:"friends" },
];
describe("broader catalogue and focused maps", () => {
  it("has twenty distinct source-supported snapshots without duplicating products", () => {
    expect(events.length).toBe(20);
    expect(new Set(events.map(event=>event.id)).size).toBe(events.length);
    for (const event of events) {
      expect(isEligible(event,today)).toBe(true);
      expect(event.sourceUrls.length).toBeGreaterThan(0);
      expect(event.organiser).toBeTruthy();
      for (const tag of event.bridgeFromTags) expect(event.bridgeExplanations[tag]).toBeTruthy();
    }
  });
  it("gives contrasting users different choices and supported links, with at most three events", () => {
    const selections = profiles.map(profile=>recommend(profile,events,today));
    expect(new Set(selections.map(list=>list.map(item=>item.event.id).sort().join("|"))).size).toBeGreaterThanOrEqual(5);
    selections.forEach((list,index) => {
      expect(list.length).toBeGreaterThan(0); expect(list.length).toBeLessThanOrEqual(3);
      expect(recommend(profiles[index],events,today)).toEqual(list);
      list.forEach(item => item.matchedTags.forEach(tag => {
        expect(profiles[index].interests).toContain(tag);
        expect(item.event.tags.includes(tag) || !!item.event.bridgeExplanations[tag]).toBe(true);
      }));
    });
  });
  it("replaces only one event from the safe eligible pool without revisiting skipped events", () => {
    const pool = rankRecommendations(profiles[0],events,today), selected = recommend(profiles[0],events,today);
    const changed = nextConnection(pool,selected,selected[0].event.id);
    expect(changed).not.toBeNull();
    expect(changed!.slice(1)).toEqual(selected.slice(1));
    expect(changed![0].event.id).not.toBe(selected[0].event.id);
    expect(nextConnection(pool,selected,"not-selected")).toBeNull();
    expect(nextConnection(pool,selected,selected[0].event.id,pool.map(item=>item.event.id))).toBeNull();
  });
  it("does not pad a short filtered catalogue or promote ineligible data", () => {
    expect(recommend(defaultProfile,events.slice(0,1),today)).toHaveLength(1);
    expect(recommend(defaultProfile,events.map(event=>({...event,availability:"sold-out" as const})),today)).toEqual([]);
    expect(recommend({...defaultProfile,dateFrom:"2099-01-01"},events,today)).toEqual([]);
  });
});
describe("optional personal intent is backward compatible", () => {
  it("retains validated notes/accepted summary and sanitizes malformed storage", () => {
    const profile=validateProfile({balanceSGD:45,savedEventIds:["fat-kids"],acceptedMemorySummary:"<Music mattered>",journeyNotes:{"fat-kids":{reason:"Something new",note:"<See a new form>"},"bad/id":{note:"ignored"},evil:"not an object"}});
    expect(profile.acceptedMemorySummary).toBe("Music mattered");
    expect(profile.journeyNotes).toEqual({"fat-kids":{reason:"Something new",note:"See a new form"}});
    expect(profile.balanceSGD).toBe(45);
    expect(validateProfile({interests:["jazz"]}).journeyNotes).toEqual({});
  });
});
