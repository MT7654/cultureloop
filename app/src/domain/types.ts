export type VerificationStatus =
  "verified_eligible" | "unverified_demo" | "expired";
export type Occasion = "date" | "friends" | "family" | "solo" | "flexible";
export type Mood =
  | "intimate"
  | "energetic"
  | "reflective"
  | "playful"
  | "romantic"
  | "experimental";
export type Category =
  | "music"
  | "theatre"
  | "heritage"
  | "visual-arts"
  | "workshop"
  | "film"
  | "literature"
  | "other";
export type Interest =
  | "indie"
  | "jazz"
  | "electronic"
  | "pop"
  | "theatre"
  | "film"
  | "art"
  | "heritage"
  | "literature"
  | "workshop"
  | "gaming"
  | "orchestral";

export const interestLabels: Record<Interest, string> = {
  indie: "Indie & alternative",
  jazz: "Jazz",
  electronic: "Electronic",
  pop: "Pop & Mandopop",
  theatre: "Theatre & musicals",
  film: "Film & storytelling",
  art: "Visual arts",
  heritage: "History & heritage",
  literature: "Literature",
  workshop: "Hands-on making",
  gaming: "Gaming",
  orchestral: "Orchestral",
};

export interface CultureEvent {
  id: string;
  title: string;
  description: string;
  organiser?: string;
  category: Category;
  tags: Interest[];
  culturalNotes: string[];
  bridgeFromTags: Interest[];
  /** Editorial interpretations linking tastes to real, source-supported features. */
  bridgeExplanations: Partial<Record<Interest, string>>;
  occasions: Occasion[];
  location?: string;
  startDate?: string;
  endDate?: string;
  startingPriceSGD: number | null;
  priceNote?: string;
  officialListingUrl: string;
  sourceUrls: string[];
  verifiedAt: string | null;
  verificationStatus: VerificationStatus;
  verificationMethod?: "primary-page" | "indexed-primary-page";
  availability?: "unknown" | "sold-out";
  imageUrl?: string;
  imageCredit?: string;
  actualAudioUrl?: string;
}

export interface CultureProfile {
  balanceSGD: number;
  /** Optional user-approved interpretation; never applied before explicit acceptance. */
  acceptedMemorySummary?: string;
  /** Local personal intent, not attendance or redemption history. */
  journeyNotes?: Record<string, { reason: string; note: string }>;
  /** Legacy field retained for storage compatibility; soundtrack now derives from interests. */
  mood?: Mood;
  previousCategory?: Category;
  previousTitle?: string;
  previousSentiment?: "loved" | "okay" | "not-for-me";
  previousHighlights: string[];
  previousOccasion?: Occasion;
  interests: Interest[];
  nextOccasion: Occasion;
  timingPreference?: "any" | "weekday-evening" | "weekend";
  savedEventIds: string[];
  selfReportedAttendance: string[];
  surpriseMe?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface Recommendation {
  event: CultureEvent;
  score: number;
  explanation: string;
  /** Includes direct tastes and the explicit source taste for editorial bridges. */
  matchedTags: Interest[];
  bridge: boolean;
  breakdown: {
    interest: number;
    past: number;
    occasion: number;
    budget: number;
    bridge: number;
    freshness: number;
  };
}
