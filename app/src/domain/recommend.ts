import {
  interestLabels,
  type Category,
  type CultureEvent,
  type CultureProfile,
  type Interest,
  type Recommendation,
} from "./types";
import { budget } from "./budget";
import { validateProfile } from "./profile";
export { budget } from "./budget";

const tasteCategory: Record<Interest, Category> = {
  indie: "music",
  jazz: "music",
  electronic: "music",
  pop: "music",
  orchestral: "music",
  theatre: "theatre",
  film: "film",
  art: "visual-arts",
  heritage: "heritage",
  literature: "literature",
  workshop: "workshop",
  gaming: "other",
};
const validDate = (value?: string): value is string =>
  !!value &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(value)) &&
  new Date(value).toISOString().slice(0, 10) === value;
export function singaporeToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  return ["year", "month", "day"]
    .map((type) => parts.find((part) => part.type === type)?.value)
    .join("-");
}
export function isEligible(
  event: CultureEvent,
  today = singaporeToday(),
): boolean {
  const official =
    /^https:\/\/(www\.)?(sgculturepass\.gov\.sg|sistic\.com\.sg|cp\.bookmyshow\.sg|bookmyshow\.sg|klook\.com)\//.test(
      event.officialListingUrl,
    );
  const priceValid =
    event.startingPriceSGD === null ||
    (Number.isFinite(event.startingPriceSGD) && event.startingPriceSGD >= 0);
  return (
    event.verificationStatus === "verified_eligible" &&
    !!event.verifiedAt &&
    official &&
    priceValid &&
    !!event.id &&
    !!event.title.trim() &&
    !!event.description.trim() &&
    validDate(event.startDate) &&
    validDate(event.endDate) &&
    event.startDate <= event.endDate &&
    event.endDate >= today &&
    event.availability !== "sold-out"
  );
}

/** Weighted editorial ranking. Scores are sorting aids, never a probability. */
export function rankRecommendations(
  input: CultureProfile,
  events: CultureEvent[],
  today = singaporeToday(),
): Recommendation[] {
  const profile = validateProfile(input);
  const ranked = events
    .filter((event) => isEligible(event, today))
    .filter(
      (event) =>
        (!profile.dateFrom || event.endDate! >= profile.dateFrom) &&
        (!profile.dateTo || event.startDate! <= profile.dateTo),
    )
    .filter(
      (event) =>
        profile.previousSentiment !== "not-for-me" ||
        event.category !== profile.previousCategory ||
        profile.interests.some((tag) => tasteCategory[tag] === event.category),
    )
    .map((event) => {
      const direct = profile.interests.filter((tag) =>
        event.tags.includes(tag),
      );
      const source = profile.interests.find(
        (tag) =>
          event.bridgeFromTags.includes(tag) && !!event.bridgeExplanations[tag],
      );
      const bridge =
        !!source &&
        (event.category !== profile.previousCategory || direct.length === 0);
      const same = event.category === profile.previousCategory;
      const past = !profile.previousCategory
        ? 7.5
        : same
          ? profile.previousSentiment === "loved"
            ? 15
            : profile.previousSentiment === "not-for-me"
              ? 0
              : 7.5
          : profile.previousHighlights.some(
                (highlight) => highlight === "story" || highlight === "music",
              ) && bridge
            ? 8
            : 3;
      const estimate = budget(profile.balanceSGD, event.startingPriceSGD);
      const budgetScore =
        estimate.cashTopUp === null
          ? 7.5
          : estimate.cashTopUp === 0
            ? 15
            : event.startingPriceSGD! > 0
              ? (15 * profile.balanceSGD) / event.startingPriceSGD!
              : 15;
      const daysAway = Math.max(
        0,
        (Date.parse(event.startDate!) - Date.parse(today)) / 86400000,
      );
      const breakdown = {
        interest: profile.interests.length
          ? (30 * direct.length) / profile.interests.length
          : 15,
        past,
        occasion:
          profile.nextOccasion === "flexible"
            ? 10
            : event.occasions.includes(profile.nextOccasion)
              ? 15
              : 7.5,
        budget: budgetScore,
        bridge: bridge ? 15 : 0,
        freshness: daysAway <= 30 ? 10 : daysAway <= 90 ? 7 : 4,
      };
      const explanation =
        bridge && source
          ? `Your interest in ${interestLabels[source].toLowerCase()} connects here: ${event.bridgeExplanations[source]}`
          : direct.length
            ? `Because you enjoy ${direct.map((tag) => interestLabels[tag].toLowerCase()).join(" and ")}, explore this: ${event.culturalNotes[0] ?? event.description}`
            : same && profile.previousSentiment === "loved"
              ? `You enjoyed live ${event.category.replace("-", " ")}. Here is another way to explore it: ${event.culturalNotes[0] ?? event.description}`
              : `A new cultural chapter to consider: ${event.culturalNotes[0] ?? event.description}`;
      return {
        event,
        score:
          Math.round(
            Object.values(breakdown).reduce((sum, value) => sum + value, 0) *
              10,
          ) / 10,
        explanation,
        matchedTags: [
          ...new Set([...direct, ...(bridge && source ? [source] : [])]),
        ],
        bridge,
        breakdown,
      };
    })
    .sort((a, b) =>
      profile.surpriseMe && a.bridge !== b.bridge
        ? Number(b.bridge) - Number(a.bridge)
        : b.score - a.score || a.event.id.localeCompare(b.event.id),
    );
  return ranked;
}

/** Show a small set from a larger pool; variety never outranks a much stronger match. */
export function selectRecommendations(ranked: Recommendation[], input: CultureProfile): Recommendation[] {
  const profile = validateProfile(input);
  if (ranked.length <= 3) return ranked;
  const selected: Recommendation[] = [];
  const add = (candidate?: Recommendation) => {
    if (candidate && !selected.includes(candidate)) selected.push(candidate);
  };
  // Retain the strongest match, a justified bridge, then maximise category variety.
  add(ranked[0]);
  add(
    ranked.find(
      (item) =>
        item.bridge &&
        item.score >= ranked[0].score - 20 &&
        !selected.includes(item) &&
        item.event.category !== selected[0].event.category,
    ) ?? ranked.find((item) => item.bridge && item.score >= ranked[0].score - 20 && !selected.includes(item)),
  );
  if (
    profile.previousCategory &&
    !profile.surpriseMe &&
    !selected.some((item) => item.event.category === profile.previousCategory)
  ) {
    add(
      ranked.find((item) => item.event.category === profile.previousCategory && item.score >= ranked[0].score - 20),
    );
  }
  while (selected.length < 3)
    add(
      ranked.find(
        (item) =>
          !selected.includes(item) &&
          item.score >= (ranked.find(candidate => !selected.includes(candidate))?.score ?? 0) - 10 &&
          !selected.some(
            (chosen) => chosen.event.category === item.event.category,
          ),
      ) ?? ranked.find((item) => !selected.includes(item)),
    );
  return selected.sort((a, b) => ranked.indexOf(a) - ranked.indexOf(b));
}

export function recommend(input: CultureProfile, events: CultureEvent[], today = singaporeToday()): Recommendation[] {
  return selectRecommendations(rankRecommendations(input, events, today), input);
}

/** Replace one chapter, preserving the others and excluding previously explored alternatives. */
export function nextConnection(pool: Recommendation[], selected: Recommendation[], selectedId: string, skipped: string[] = []): Recommendation[] | null {
  const index = selected.findIndex(item => item.event.id === selectedId);
  if (index < 0) return null;
  const alternative = pool.find(item => !selected.some(current => current.event.id === item.event.id)
    && !skipped.includes(item.event.id) && item.score >= selected[index].score - 20
    && (item.matchedTags.length > 0 || item.breakdown.past >= 7.5 || item.breakdown.interest === 15));
  if (!alternative) return null;
  return selected.map((item, position) => position === index ? alternative : item);
}
