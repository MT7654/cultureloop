import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  Check,
  Plus,
  Minus,
  Infinity as LoopIcon,
  Sparkles,
  Headphones,
  MapPin,
  Calendar,
  ExternalLink,
  X,
  List,
  Orbit,
  Music,
  Drama,
  Palette,
  BookOpen,
  Landmark,
  Clapperboard,
  Gamepad2,
  Waves,
  Heart,
  Users,
  User,
  SlidersHorizontal,
} from "lucide-react";
import AudioPreview from "./components/AudioPreview";
import EventCover from "./components/EventCover";
import InterestArt from "./components/InterestArt";
import JourneyIntent from "./components/JourneyIntent";
import CulturalStory from "./components/CulturalStory";
import { MemoryInterpreter } from "./components/MemoryInterpreter";
import { ConnectionNarration, clearConnectionNarrations } from "./components/ConnectionNarration";
import {
  AtmosphereProvider,
  AtmosphereControls,
  useAtmosphere,
} from "./components/Atmosphere";
import type { Recommendation } from "./domain/types";
import { initialNavigation, screens, TAB_KEY, type Screen } from "./domain/session";
import { events, catalogueNotice } from "./data/events";
import { recommend, rankRecommendations, selectRecommendations, nextConnection } from "./domain/recommend";
import { defaultProfile, demoProfile, validateProfile } from "./domain/profile";
import type {
  CultureProfile,
  CultureEvent,
  Category,
  Occasion,
  Interest,
} from "./domain/types";

const Constellation3D = lazy(() => import("./components/Constellation3D"));
function SpatialView(props: {
  recommendations: Recommendation[];
  profile: CultureProfile;
  selectedId: string;
  onSelect: (id: string) => void;
  onOpen?: (id: string) => void;
  compact?: boolean;
}) {
  const { energyRef, playing, muted, volume } = useAtmosphere();
  return (
    <Suspense
      fallback={
        <div className="scene-loading">Preparing your cultural atlas…</div>
      }
    >
      <Constellation3D
        {...props}
        energy={energyRef}
        soundActive={playing && !muted && volume > 0}
      />
    </Suspense>
  );
}
function SoundNavigation({ screen }: { screen: Screen }) {
  const { playing, stop } = useAtmosphere();
  useEffect(() => {
    if (screen === "welcome") stop();
  }, [screen, stop]);
  return playing && !["welcome", "dna", "discover", "experience"].includes(screen) ? (
    <div className="journey-player">
      <AtmosphereControls />
    </div>
  ) : null;
}
const tastes: {
  id: Interest;
  name: string;
  note: string;
  icon: typeof Music;
}[] = [
  {
    id: "indie",
    name: "Indie & alternative",
    note: "Off the beaten track",
    icon: Headphones,
  },
  {
    id: "pop",
    name: "Pop & Mandopop",
    note: "Your favourite chorus",
    icon: Music,
  },
  { id: "jazz", name: "Jazz", note: "Room to improvise", icon: Waves },
  {
    id: "electronic",
    name: "Electronic",
    note: "Feel the frequency",
    icon: Waves,
  },
  {
    id: "theatre",
    name: "Theatre & musicals",
    note: "Another point of view",
    icon: Drama,
  },
  {
    id: "film",
    name: "Film & storytelling",
    note: "Stories that stay",
    icon: Clapperboard,
  },
  {
    id: "art",
    name: "Visual arts",
    note: "See a little differently",
    icon: Palette,
  },
  {
    id: "heritage",
    name: "History & heritage",
    note: "Closer to our roots",
    icon: Landmark,
  },
  {
    id: "literature",
    name: "Literature",
    note: "Between the lines",
    icon: BookOpen,
  },
  {
    id: "workshop",
    name: "Creative workshops",
    note: "Make something yours",
    icon: Palette,
  },
  {
    id: "gaming",
    name: "Gaming",
    note: "Worlds worth exploring",
    icon: Gamepad2,
  },
  {
    id: "orchestral",
    name: "Orchestral",
    note: "Something sweeping",
    icon: Music,
  },
];
const label = (id: string) => tastes.find((t) => t.id === id)?.name || id;
const money = (n: number) =>
  `S$${n.toLocaleString("en-SG", { maximumFractionDigits: 2 })}`;
const catLabel = (c: string) =>
  ({
    music: "Live music",
    theatre: "Theatre",
    heritage: "Heritage",
    "visual-arts": "Visual arts",
    workshop: "Making",
    film: "Film",
    literature: "Literature",
    other: "Culture",
  })[c] || c;
const dateLabel = (e: CultureEvent) =>
  e.startDate
    ? new Date(`${e.startDate}T12:00:00+08:00`).toLocaleDateString("en-SG", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Singapore",
      })
    : "Dates on official listing";
const occasions: { id: Occasion; name: string; icon: typeof Heart }[] = [
  { id: "date", name: "A date", icon: Heart },
  { id: "friends", name: "Friends", icon: Users },
  { id: "solo", name: "On my own", icon: User },
  { id: "family", name: "Family", icon: Users },
  { id: "flexible", name: "Open to anything", icon: Sparkles },
];
function readState() {
  try {
    const raw = JSON.parse(localStorage.getItem("cultureloop:ui:v1") || "null");
    if (!raw || typeof raw !== "object" || !raw.profile) return null;
    return {
      profile: validateProfile(raw.profile),
    };
  } catch {
    return null;
  }
}
export default function App() {
  const stored = useMemo(readState, []),
    entry = useMemo(() => {
      let tab: unknown;
      try { tab = JSON.parse(sessionStorage.getItem(TAB_KEY) || "null"); } catch { /* Storage is optional. */ }
      const type = (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined)?.type || "navigate";
      const result = initialNavigation(location.hash, type, tab);
      if (result.screen === "experience" && !events.some(e => e.id === result.selectedEvent)) result.screen = "discover";
      return result;
    }, []),
    [profile, setProfile] = useState<CultureProfile>(
      stored?.profile || { ...defaultProfile },
    ),
    [screen, setScreen] = useState<Screen>(entry.screen),
    [active, setActive] = useState(""),
    [selectedEvent, setSelectedEvent] = useState<string>(entry.selectedEvent),
    [listMode, setListMode] = useState(entry.listMode),
    [affordable, setAffordable] = useState(entry.affordable),
    [surprise, setSurprise] = useState(false),
    [storageWarning, setStorageWarning] = useState(false),
    [resetOpen, setResetOpen] = useState(false),
    [explored, setExplored] = useState<{ key: string; ids: string[]; skipped: string[] }>({ key: "", ids: [], skipped: [] }),
    [notice, setNotice] = useState("");
  const heading = useRef<HTMLHeadingElement>(null),
    initial = useRef(true),
    focusPending = useRef(false);
  const patch = (p: Partial<CultureProfile>) =>
    setProfile((prev) => ({ ...prev, ...p }));
  const ranked = useMemo(
    () =>
      rankRecommendations(
        profile,
        affordable
          ? events.filter(
              (e) =>
                e.startingPriceSGD !== null &&
                e.startingPriceSGD <= profile.balanceSGD,
            )
          : events,
      ),
    [profile, affordable],
  );
  const selectionKey = JSON.stringify([profile.interests, profile.balanceSGD, profile.previousCategory, profile.previousSentiment,
    profile.previousHighlights, profile.nextOccasion, profile.dateFrom, profile.dateTo, profile.surpriseMe, affordable]);
  const matches = explored.key === selectionKey
    ? explored.ids.flatMap(id => ranked.find(item => item.event.id === id) ?? [])
    : selectRecommendations(ranked, profile);
  const shown = matches.filter(
    (r) =>
      !affordable ||
      (r.event.startingPriceSGD !== null &&
        r.event.startingPriceSGD <= profile.balanceSGD),
  );
  const event = events.find((e) => e.id === selectedEvent),
    currentMatch = ranked.find((r) => r.event.id === selectedEvent);
  const activeMatch = shown.find((r) => r.event.id === active) || shown[0];
  const nextSet = activeMatch ? nextConnection(ranked, shown, activeMatch.event.id, explored.key === selectionKey ? explored.skipped : []) : null;
  const landingMatches = useMemo(() => recommend(demoProfile, events), []);
  useEffect(() => {
    try {
      localStorage.setItem(
        "cultureloop:ui:v1",
        JSON.stringify({ profile }),
      );
      setStorageWarning(false);
    } catch {
      setStorageWarning(true);
    }
  }, [profile]);
  useEffect(() => {
    try { sessionStorage.setItem(TAB_KEY, JSON.stringify({ screen, selectedEvent, listMode, affordable })); } catch { /* In-tab navigation still works without storage. */ }
  }, [screen, selectedEvent, listMode, affordable]);
  useEffect(() => {
    const back = () => {
      const next = location.hash.slice(1) as Screen;
      setScreen(screens.includes(next) ? next === "experience" && !selectedEvent ? "discover" : next : "welcome");
    };
    addEventListener("popstate", back);
    return () => removeEventListener("popstate", back);
  }, [selectedEvent]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!initial.current) focusPending.current = true;
    initial.current = false;
  }, [screen]);
  function go(next: Screen) {
    history.pushState({}, "", `#${next}`);
    setScreen(next);
    setNotice("");
  }
  function save(id: string) {
    const saved = profile.savedEventIds.includes(id);
    patch({
      savedEventIds: saved
        ? profile.savedEventIds.filter((x) => x !== id)
        : [...profile.savedEventIds, id],
    });
    setNotice(
      saved ? "Removed from your Loop." : "A new chapter, saved to your Loop.",
    );
  }
  function updateIntent(id: string, value: { reason: string; note: string }) {
    setProfile(previous => ({ ...previous, journeyNotes: { ...previous.journeyNotes, [id]: value } }));
  }
  function tryConnection() {
    if (!nextSet || !activeMatch) return;
    const replacement = nextSet.find(item => !shown.some(current => current.event.id === item.event.id));
    setExplored({ key: selectionKey, ids: nextSet.map(item => item.event.id), skipped: [...(explored.key === selectionKey ? explored.skipped : []), activeMatch.event.id] });
    if (replacement) setActive(replacement.event.id);
    setNotice("A new connection. Your other chapters stay in orbit.");
  }
  function open(id: string) {
    setSelectedEvent(id);
    go("experience");
  }
  function demo() {
    clearConnectionNarrations();
    setProfile({ ...demoProfile, savedEventIds: profile.savedEventIds, journeyNotes: profile.journeyNotes });
    setExplored({ key: "", ids: [], skipped: [] });
    setSurprise(false);
    setAffordable(false);
    go("story");
  }
  function newExploration() {
    clearConnectionNarrations();
    setProfile({ ...defaultProfile, balanceSGD: profile.balanceSGD,
      savedEventIds: [...profile.savedEventIds], selfReportedAttendance: [...profile.selfReportedAttendance], journeyNotes: profile.journeyNotes });
    setExplored({ key: "", ids: [], skipped: [] });
    setSurprise(false);
    setAffordable(false);
    setListMode(false);
    setActive("");
    setSelectedEvent("");
    go("story");
  }
  const canResume = !!(
    profile.interests.length ||
    profile.previousCategory ||
    profile.savedEventIds.length
  );
  const progress = screen === "story" ? 1 : screen === "dna" ? 2 : 3;
  return (
    <MotionConfig reducedMotion="user">
      <AtmosphereProvider interests={profile.interests}>
        <SoundNavigation screen={screen} />
        <div
          className={`app-shell screen-${screen}`}
        >
          <a
            href="#main"
            className="skip-link"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("main")?.focus();
            }}
          >
            Skip to content
          </a>
          <header className="site-header">
            <button
              className="wordmark"
              onClick={() => go("welcome")}
              aria-label="CultureLoop home"
            >
              <LoopIcon strokeWidth={2.5} />
              <span>
                cultureloop<span className="brand-dot">.</span>
              </span>
            </button>
            <nav aria-label="Main navigation">
              <button
                className={
                  screen === "discover" ? "nav-link active" : "nav-link"
                }
                onClick={() => go("discover")}
              >
                Discover <ArrowUpRight size={14} />
              </button>
              <button
                className={screen === "loop" ? "nav-link active" : "nav-link"}
                onClick={() => go("loop")}
              >
                My Loop{" "}
                <span className="save-count">
                  {profile.savedEventIds.length}
                </span>
              </button>
            </nav>
            <span className="header-edition">
              SINGAPORE, IN GOOD COMPANY <span>01° N / 103° E</span>
            </span>
          </header>
          <main id="main" tabIndex={-1}>
            <AnimatePresence mode="wait">
              <motion.div
                key={screen}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                onAnimationComplete={(definition) => {
                  if (
                    (definition as { opacity?: number }).opacity === 1 &&
                    focusPending.current
                  ) {
                    heading.current?.focus();
                    focusPending.current = false;
                  }
                }}
              >
                {screen === "welcome" && (
                  <>
                    <section className="hero hero-culture-pass">
                      <div className="hero-copy">
                        <p className="eyebrow">
                          <span className="live-dot" /> MAKE MORE OF YOUR SG CULTURE PASS
                        </p>
                        <h1 ref={heading} tabIndex={-1}>
                          Your next
                          <br />
                          cultural
                          <br />
                          <em>obsession.</em>
                        </h1>
                        <p className="hero-description">
                          <strong>Your first outing shouldn't be your last.</strong>
                          CultureLoop connects what you loved to up to three new
                          cultural experiences, with your remaining SG Culture
                          Pass credits in mind.
                        </p>
                        <div className="hero-actions">
                          <button
                            className="button primary"
                            onClick={() => go(canResume ? profile.interests.length || profile.surpriseMe ? "discover" : "story" : "story")}
                          >
                            {canResume
                              ? "Continue my journey"
                              : "Find my next chapter"}
                            <ArrowUpRight size={20} />
                          </button>
                          {canResume && <button className="text-button" onClick={newExploration}>
                            Start a new exploration <ArrowUpRight size={18} />
                          </button>}
                          <button className="text-button" onClick={demo}>
                            Try the S$45 demo <ArrowRight size={16} />
                          </button>
                        </div>
                        <div className="hero-small">
                          <span>Independent discovery companion.</span>
                          <span>No sign-up. Just curiosity.</span>
                        </div>
                      </div>
                      <div className="balance-ticket credit-story">
                        <span className="eyebrow">SG CULTURE PASS · EXAMPLE JOURNEY</span>
                        <div className="credit-equation">
                          <span><b>S$100</b><small>starting credits</small></span>
                          <span className="credit-symbol" aria-hidden="true">−</span>
                          <span><b>S$55</b><small>one outing</small></span>
                          <span className="credit-symbol" aria-hidden="true">=</span>
                          <span><b>S$45</b><small>remaining</small></span>
                        </div>
                        <p className="credit-context">Eligible Singapore Citizens received S$100 in SG Culture Pass credits for local arts and heritage.</p>
                        <p className="credit-example-note">Illustrative amounts. Your balance is entered by you.</p>
                      </div>
                      <div className="hero-art">
                        <div className="hero-spatial">
                          <SpatialView
                            compact
                            recommendations={landingMatches}
                            profile={demoProfile}
                            selectedId=""
                            onSelect={setActive}
                          />
                        </div>
                        <div className="poster-top">
                          <span>
                            A UNIVERSE OF
                            <br />
                            CONNECTIONS.
                          </span>
                          <span>
                            VOL. 01
                            <br />
                            SINGAPORE
                          </span>
                        </div>
                        <div className="poster-bottom">
                          <span>
                            ONE EXPERIENCE
                            <br />
                            CAN OPEN A WORLD.
                          </span>
                          <Orbit className="poster-arrow" size={24} />
                        </div>
                      </div>
                    </section>
                    <section className="intro-strip culture-pass-intro">
                      <span className="eyebrow">DON'T LET THE EXPERIENCE END THERE.</span>
                      <p className="chapter-steps">
                        <span>One outing</span><ArrowRight aria-hidden="true" size={18} />
                        <span>What you loved</span><ArrowRight aria-hidden="true" size={18} />
                        <span>Your next connections</span>
                      </p>
                      <button
                        onClick={() => go("story")}
                        className="round-outline"
                        aria-label="Begin your culture story"
                      >
                        <ArrowUpRight />
                      </button>
                    </section>
                  </>
                )}
                {(screen === "story" || screen === "dna") && (
                  <>
                    <div className="onboarding-top">
                      <button
                        className="back-button"
                        onClick={() =>
                          go(screen === "story" ? "welcome" : "story")
                        }
                      >
                        <ArrowLeft size={16} /> Back
                      </button>
                      <div
                        className="stepper"
                        aria-label={`Step ${progress} of 3`}
                      >
                        <span className={progress >= 1 ? "filled" : ""} />
                        <span className={progress >= 2 ? "filled" : ""} />
                        <span />
                        <small>{String(progress).padStart(2, "0")} / 03</small>
                      </div>
                      <span className="eyebrow">
                        YOUR NEXT CHAPTER STARTS HERE
                      </span>
                    </div>
                    {screen === "story" ? (
                      <section className="story-layout">
                        <aside className="onboarding-intro">
                          <p className="eyebrow">01 — YOUR CULTURE STORY</p>
                          <h1 ref={heading} tabIndex={-1}>
                            Start with
                            <br />
                            what <em>stayed.</em>
                          </h1>
                          <p>
                            The stage. The sound. The people.
                            <br /> A little about your last outing helps us
                            <br />
                            find a connection worth following.
                          </p>
                          <div className="balance-panel">
                            <label htmlFor="balance">
                              Your remaining Culture Pass credits
                            </label>
                            <div className="balance-input">
                              <span>S$</span>
                              <input
                                id="balance"
                                aria-describedby="balance-help"
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                value={profile.balanceSGD}
                                onChange={(e) =>
                                  patch({
                                    balanceSGD: Math.max(
                                      0,
                                      Math.min(100, Number(e.target.value)),
                                    ),
                                  })
                                }
                              />
                              <span className="balance-max">/ 100</span>
                            </div>
                            <input
                              aria-label="Remaining credits slider"
                              type="range"
                              min="0"
                              max="100"
                              value={profile.balanceSGD}
                              onChange={(e) =>
                                patch({ balanceSGD: Number(e.target.value) })
                              }
                            />
                            <p id="balance-help">
                              Your estimate, entered by you.
                              <br />
                              No government account is connected.
                            </p>
                          </div>
                        </aside>
                        <div className="story-form">
                          <fieldset>
                            <legend>What was your last experience?</legend>
                            <div className="choice-grid">
                              {[
                                { id: "theatre", name: "Theatre / musical" },
                                { id: "music", name: "Live music" },
                                { id: "visual-arts", name: "An exhibition" },
                                { id: "workshop", name: "A workshop" },
                                { id: "heritage", name: "A heritage tour" },
                                { id: "other", name: "Something else" },
                                { id: "", name: "I haven't used it yet" },
                              ].map((c) => (
                                <button
                                  key={c.id}
                                  className={`choice ${profile.previousCategory === c.id || (!profile.previousCategory && !c.id) ? "selected" : ""}`}
                                  aria-pressed={
                                    profile.previousCategory === c.id ||
                                    (!profile.previousCategory && !c.id)
                                  }
                                  onClick={() =>
                                    patch({
                                      previousCategory:
                                        (c.id as Category) || undefined,
                                    })
                                  }
                                >
                                  {c.name}
                                  {profile.previousCategory === c.id ||
                                  (!profile.previousCategory && !c.id) ? (
                                    <Check size={15} />
                                  ) : (
                                    <Plus size={15} />
                                  )}
                                </button>
                              ))}
                            </div>
                            <label
                              className="input-label"
                              htmlFor="previous-title"
                            >
                              Name of the experience <span>optional</span>
                            </label>
                            <input
                              id="previous-title"
                              className="text-input"
                              maxLength={120}
                              placeholder="A show, an exhibition, a moment…"
                              value={profile.previousTitle || ""}
                              onChange={(e) =>
                                patch({ previousTitle: e.target.value })
                              }
                            />
                          </fieldset>
                          {profile.previousCategory && (
                            <>
                              <fieldset>
                                <legend>How did it feel?</legend>
                                <div className="inline-choices">
                                  {[
                                    {
                                      id: "loved",
                                      name: "Loved it",
                                      symbol: "♡",
                                    },
                                    {
                                      id: "okay",
                                      name: "It was okay",
                                      symbol: "~",
                                    },
                                    {
                                      id: "not-for-me",
                                      name: "Not my thing",
                                      symbol: "↗",
                                    },
                                  ].map((s) => (
                                    <button
                                      key={s.id}
                                      aria-pressed={
                                        profile.previousSentiment === s.id
                                      }
                                      className={`choice ${profile.previousSentiment === s.id ? "selected" : ""}`}
                                      onClick={() =>
                                        patch({
                                          previousSentiment:
                                            s.id as CultureProfile["previousSentiment"],
                                        })
                                      }
                                    >
                                      <span>{s.symbol}</span>
                                      {s.name}
                                    </button>
                                  ))}
                                </div>
                              </fieldset>
                              <fieldset>
                                <legend>
                                  What stayed with you?{" "}
                                  <small>Choose up to two</small>
                                </legend>
                                <div className="chip-row">
                                  {[
                                    { id: "music", name: "The music" },
                                    { id: "story", name: "The story" },
                                    {
                                      id: "atmosphere",
                                      name: "The atmosphere",
                                    },
                                    { id: "making", name: "Making something" },
                                    {
                                      id: "learning",
                                      name: "Learning something",
                                    },
                                    { id: "together", name: "Time together" },
                                  ].map(({ id: h, name }) => (
                                    <button
                                      key={h}
                                      className={`chip ${profile.previousHighlights.includes(h) ? "selected" : ""}`}
                                      aria-pressed={profile.previousHighlights.includes(
                                        h,
                                      )}
                                      onClick={() => {
                                        const hs = profile.previousHighlights;
                                        if (hs.includes(h))
                                          patch({
                                            previousHighlights: hs.filter(
                                              (x) => x !== h,
                                            ),
                                          });
                                        else if (hs.length < 2)
                                          patch({
                                            previousHighlights: [...hs, h],
                                          });
                                        else
                                          setNotice(
                                            "Choose up to two highlights. Deselect one to change it.",
                                          );
                                      }}
                                    >
                                      {name}
                                      {profile.previousHighlights.includes(
                                        h,
                                      ) && <Check size={13} />}
                                    </button>
                                  ))}
                                </div>
                              </fieldset>
                              <fieldset>
                                <legend>Who did you go with?</legend>
                                <div className="chip-row">
                                  {occasions
                                    .filter((o) => o.id !== "flexible")
                                    .map((o) => (
                                      <button
                                        key={o.id}
                                        className={`chip ${profile.previousOccasion === o.id ? "selected" : ""}`}
                                        aria-pressed={
                                          profile.previousOccasion === o.id
                                        }
                                        onClick={() =>
                                          patch({ previousOccasion: o.id })
                                        }
                                      >
                                        <o.icon size={15} />
                                        {o.name}
                                      </button>
                                    ))}
                                </div>
                              </fieldset>
                            </>
                          )}
                          <MemoryInterpreter
                            selectionKey={JSON.stringify([profile.previousCategory, profile.previousTitle, profile.previousHighlights, profile.interests])}
                            onAccept={result => {
                              const fits = result.interests.every(item => profile.interests.includes(item.value) || profile.interests.length + result.interests.filter(suggestion => !profile.interests.includes(suggestion.value)).length <= 5)
                                && result.highlights.every(item => profile.previousHighlights.includes(item.value) || profile.previousHighlights.length + result.highlights.filter(suggestion => !profile.previousHighlights.includes(suggestion.value)).length <= 2);
                              setProfile(previous => ({ ...previous,
                                acceptedMemorySummary: result.summary,
                                interests: [...new Set([...previous.interests, ...result.interests.map(item => item.value)])].slice(0, 5),
                                previousHighlights: [...new Set([...previous.previousHighlights, ...result.highlights.map(item => item.value)])].slice(0, 2),
                              }));
                              setNotice(fits ? "Your connections are accepted. Adjust your tastes in the next step." : "Your existing choices are kept. Make room in your selected tastes or highlights to add the remaining suggestions.");
                            }}
                          />
                          {profile.acceptedMemorySummary && <p className="accepted-memory">Your accepted memory: {profile.acceptedMemorySummary}</p>}
                          <div className="form-footer">
                            <button
                              className="text-button"
                              onClick={() => {
                                patch({
                                  previousCategory: undefined,
                                  previousTitle: "",
                                  previousHighlights: [],
                                });
                                go("dna");
                              }}
                            >
                              Skip this chapter
                            </button>
                            <button
                              className="button primary"
                              onClick={() => go("dna")}
                            >
                              What moves you <ArrowRight size={18} />
                            </button>
                          </div>
                        </div>
                      </section>
                    ) : (
                      <section className="dna-layout">
                        <div className="dna-heading">
                          <div>
                            <p className="eyebrow">02 — YOUR CULTURAL DNA</p>
                            <h1 ref={heading} tabIndex={-1}>
                              What <em>moves you?</em>
                            </h1>
                            <p>
                              Pick the things you gravitate towards. We'll
                              connect the dots.
                            </p>
                          </div>
                          <span className="selected-counter">
                            {profile.interests.length}{" "}
                            <small>/ 5 selected</small>
                          </span>
                        </div>
                        <div className="taste-grid">
                          {tastes.map((t, i) => {
                            const selected = profile.interests.includes(t.id);
                            return (
                              <motion.button
                                key={t.id}
                                whileTap={{ scale: 0.97 }}
                                aria-pressed={selected}
                                className={`taste-tile taste-${i % 4} ${selected ? "selected" : ""}`}
                                onClick={() => {
                                  if (selected)
                                    patch({
                                      interests: profile.interests.filter(
                                        (x) => x !== t.id,
                                      ),
                                    });
                                  else if (profile.interests.length < 5)
                                    patch({
                                      interests: [...profile.interests, t.id],
                                    });
                                  else
                                    setNotice(
                                      "Five is a good starting point. Deselect one to choose another.",
                                    );
                                  patch({ surpriseMe: false });
                                  setSurprise(false);
                                }}
                              >
                                <div className="taste-art" aria-hidden="true">
                                  <InterestArt interest={t.id} />
                                </div>
                                <span className="taste-icon">
                                  <t.icon size={24} strokeWidth={1.3} />
                                </span>
                                <span className="taste-check">
                                  {selected ? (
                                    <Check size={15} />
                                  ) : (
                                    <Plus size={15} />
                                  )}
                                </span>
                                <b>{t.name}</b>
                                <span>{t.note}</span>
                              </motion.button>
                            );
                          })}
                        </div>
                        <div className="onboarding-sound-note">
                          <div><Headphones size={22} /><p>Your tastes shape your soundtrack.<br /><span>An original mix, ready when you press play.</span></p></div>
                          <AtmosphereControls />
                        </div>
                        <div className="dna-bottom">
                          <fieldset>
                            <legend>Who’s in your next chapter?</legend>
                            <div className="chip-row">
                              {occasions.map((o) => (
                                <button
                                  key={o.id}
                                  className={`chip ${profile.nextOccasion === o.id ? "selected" : ""}`}
                                  aria-pressed={profile.nextOccasion === o.id}
                                  onClick={() => patch({ nextOccasion: o.id })}
                                >
                                  <o.icon size={14} />
                                  {o.name}
                                </button>
                              ))}
                            </div>
                            <label className="timing-label" htmlFor="timing">
                              When works for you?{" "}
                              <select
                                id="timing"
                                value={profile.timingPreference || "any"}
                                onChange={(e) =>
                                  patch({
                                    timingPreference: e.target
                                      .value as CultureProfile["timingPreference"],
                                  })
                                }
                              >
                                <option value="any">Any time</option>
                                <option value="weekend">Weekend</option>
                                <option value="weekday-evening">
                                  Weekday evening
                                </option>
                              </select>
                            </label>
                            <small className="timing-note">
                              A planning note; confirm individual sessions on
                              the official listing.
                            </small>
                          </fieldset>
                          <div className="dna-actions">
                            <button
                              className="text-button"
                              onClick={() => {
                                patch({ interests: [], surpriseMe: true });
                                setSurprise(true);
                                go("discover");
                              }}
                            >
                              <Sparkles size={16} /> Surprise me
                            </button>
                            <button
                              className="button primary"
                              disabled={!profile.interests.length}
                              onClick={() => go("discover")}
                            >
                              Reveal my CultureLoop <ArrowUpRight size={19} />
                            </button>
                          </div>
                        </div>
                      </section>
                    )}
                  </>
                )}
                {screen === "discover" && (
                  <section className="discovery">
                    <div className="page-title-row">
                      <div>
                        <p className="eyebrow">03 — FOLLOW THE CONNECTION</p>
                        <h1 ref={heading} tabIndex={-1}>
                          A little familiar.
                          <br />
                          <em>A little unexpected.</em>
                        </h1>
                        <p>
                          {profile.previousCategory
                            ? `From ${profile.previousTitle || catLabel(profile.previousCategory).toLowerCase()} to a new point of view.`
                            : "Your next favourite thing could start anywhere."}{" "}
                          These are your next chapters.
                        </p>
                      </div>
                      <div className="credits-pill">
                        <span>YOUR ENTERED BALANCE</span>
                        <b>{money(profile.balanceSGD)}</b>
                        <button onClick={() => go("story")}>
                          Edit your story <ArrowUpRight size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="discovery-toolbar">
                      <div className="view-toggle">
                        <button
                          aria-pressed={!listMode}
                          onClick={() => setListMode(false)}
                        >
                          <Orbit size={16} /> Constellation
                        </button>
                        <button
                          aria-pressed={listMode}
                          onClick={() => setListMode(true)}
                        >
                          <List size={16} /> List view
                        </button>
                      </div>
                      <div className="discovery-filters">
                        <button
                          className={`chip ${affordable ? "selected" : ""}`}
                          aria-pressed={affordable}
                          onClick={() => setAffordable(!affordable)}
                        >
                          <SlidersHorizontal size={14} /> Within my credits
                        </button>
                        <button
                          className="text-button"
                          onClick={() => go("dna")}
                        >
                          Remix my tastes <ArrowUpRight size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="discovery-sound-bar">
                      <p>Your tastes. Your soundtrack.<span>Original music inspired by your selections.</span></p>
                      <AtmosphereControls />
                    </div>
                    {!listMode && (
                      <div className="constellation">
                        <div className="constellation-caption">
                          <span className="eyebrow">
                            YOUR CULTURE CONSTELLATION
                          </span>
                          <span>Tap an experience. See the connection.</span>
                        </div>
                        <div className="constellation-layout">
                          <SpatialView
                            recommendations={shown}
                            profile={profile}
                            selectedId={activeMatch?.event.id || ""}
                            onSelect={setActive}
                            onOpen={open}
                          />
                          {shown.length > 0 && (
                            <div className="connection-explanation">
                              <div className="connection-cover">
                                <EventCover event={activeMatch.event} />
                              </div>
                              <span className="eyebrow">
                                NOW IN YOUR ORBIT ·{" "}
                                {catLabel(activeMatch.event.category)}
                              </span>
                              <h2>{activeMatch.event.title}</h2>
                              <span className="connection-meta">
                                {dateLabel(activeMatch.event)} · From{" "}
                                {activeMatch.event.startingPriceSGD === null
                                  ? "official price"
                                  : money(activeMatch.event.startingPriceSGD)}
                              </span>
                              <p>
                                {
                                  (
                                    shown.find((r) => r.event.id === active) ||
                                    shown[0]
                                  ).explanation
                                }
                              </p>
                              <button
                                className="text-button"
                                onClick={() =>
                                  open(
                                    (
                                      shown.find(
                                        (r) => r.event.id === active,
                                      ) || shown[0]
                                    ).event.id,
                                  )
                                }
                              >
                                Explore this <ArrowUpRight size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {shown.length > 0 && <div className="connection-choice">
                      <button className="text-button" onClick={tryConnection} disabled={!nextSet}>Try another connection <ArrowRight size={16}/></button>
                      <p>{nextSet ? `${events.length} curated experiences. Swap one chapter; keep the rest in orbit.` : "These are your current connections. Remix your tastes to explore further."}</p>
                    </div>}
                    {listMode && <><div className="section-label">
                      <span>
                        {shown.length} CONNECTION{shown.length === 1 ? "" : "S"}{" "}
                        WORTH EXPLORING
                      </span>
                      <span>CURATED IN SINGAPORE · PERSONAL TO YOU</span>
                    </div>
                    <div className="event-grid" aria-live="polite">
                      {shown.map((r, i) => (
                        <motion.article
                          key={r.event.id}
                          className="event-card"
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                        >
                          <div className="event-art">
                            <button
                              className="art-open"
                              onClick={() => open(r.event.id)}
                              aria-label={`Explore ${r.event.title}`}
                            >
                              <EventCover event={r.event} />
                            </button>
                            <span className="event-number">
                              CHAPTER {String(i + 1).padStart(2, "0")}
                            </span>
                            <button
                              className={`save-button ${profile.savedEventIds.includes(r.event.id) ? "saved" : ""}`}
                              onClick={() => save(r.event.id)}
                              aria-label={`${profile.savedEventIds.includes(r.event.id) ? "Unsave" : "Save"} ${r.event.title}`}
                              aria-pressed={profile.savedEventIds.includes(
                                r.event.id,
                              )}
                            >
                              <Bookmark
                                size={18}
                                fill={
                                  profile.savedEventIds.includes(r.event.id)
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            </button>
                          </div>
                          <div className="event-card-body">
                            <span className="eyebrow">
                              {r.bridge
                                ? "↗ THE TASTE BRIDGE"
                                : i === 0
                                  ? "● IN YOUR ORBIT"
                                  : "✧ SOMETHING DIFFERENT"}{" "}
                              · {catLabel(r.event.category)}
                            </span>
                            <button
                              className="event-title"
                              onClick={() => open(r.event.id)}
                            >
                              {r.event.title}
                            </button>
                            <p className="event-meta">
                              {dateLabel(r.event)} ·{" "}
                              {r.event.location || "Venue on official listing"}
                            </p>
                            <small className="card-verification">
                              Eligibility source checked ·{" "}
                              {r.event.verifiedAt?.slice(0, 10)}
                            </small>
                            <p className="match-reason">{r.explanation}</p>
                            <div className="card-price">
                              <span>
                                {r.event.startingPriceSGD === null
                                  ? "Price on official site"
                                  : `From ${money(r.event.startingPriceSGD)}`}
                                <small>
                                  {r.event.startingPriceSGD === null
                                    ? "Price not verified"
                                    : r.event.startingPriceSGD <=
                                        profile.balanceSGD
                                      ? "Within your entered credits"
                                      : `Estimated top-up ${money(Math.max(0, r.event.startingPriceSGD - profile.balanceSGD))}`}
                                </small>
                              </span>
                              <button
                                className="round-outline"
                                onClick={() => open(r.event.id)}
                                aria-label={`Preview ${r.event.title}`}
                              >
                                <ArrowUpRight size={20} />
                              </button>
                            </div>
                          </div>
                        </motion.article>
                      ))}
                    </div>
                    </>}
                    {shown.length === 0 && (
                      <div className="empty-state">
                        <Orbit size={36} />
                        <h2>
                          {affordable
                            ? "A little beyond this balance."
                            : "The catalogue is between chapters."}
                        </h2>
                        <p>
                          {affordable
                            ? "Your connections need a top-up at their listed starting prices. See them with the estimates, or adjust your story."
                            : "No verified current candidates remain in this small offline catalogue. Explore the official portal for current experiences."}
                        </p>
                        {affordable ? (
                          <button
                            className="button primary"
                            onClick={() => setAffordable(false)}
                          >
                            Show connections with top-up estimates{" "}
                            <ArrowRight size={18} />
                          </button>
                        ) : (
                          <a
                            className="button primary"
                            href="https://www.sgculturepass.gov.sg/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Browse official Culture Pass{" "}
                            <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                    )}
                    <p className="trust-note">
                      {catalogueNotice} Estimates are for one ticket, before
                      possible fees.
                    </p>
                  </section>
                )}
                {screen === "experience" && event && (
                  <section className="experience">
                    <button
                      className="back-button"
                      onClick={() => go("discover")}
                    >
                      <ArrowLeft size={16} /> Back to your connections
                    </button>
                    <div className="experience-layout">
                      <div className="experience-title">
                        <p className="eyebrow">
                          YOUR NEXT CHAPTER · {catLabel(event.category)}
                        </p>
                        <h1 ref={heading} tabIndex={-1}>
                          {event.title}
                        </h1>
                        <p className="experience-quick-facts">
                          {dateLabel(event)} ·{" "}
                          {event.startingPriceSGD === null
                            ? "See official price"
                            : `From ${money(event.startingPriceSGD)}`}
                        </p>
                      </div>
                      <AudioPreview category={event.category} event={event} />
                      <div className="experience-details">
                        <p className="event-description">{event.description}</p>
                        <div className="event-facts">
                          <div>
                            <Calendar size={17} />
                            <span>
                              {dateLabel(event)}
                              {event.endDate &&
                                event.endDate !== event.startDate &&
                                ` — ${new Date(`${event.endDate}T12:00:00+08:00`).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Singapore" })}`}
                            </span>
                          </div>
                          <div>
                            <MapPin size={17} />
                            <span>
                              {event.location ||
                                "Confirm venue on official listing"}
                            </span>
                          </div>
                          {event.organiser && (
                            <div>
                              <Users size={17} />
                              <span>{event.organiser}</span>
                            </div>
                          )}
                        </div>
                        <div className="your-bridge">
                          <span className="eyebrow">
                            <Sparkles size={14} /> YOUR BRIDGE
                          </span>
                          <p>
                            {currentMatch?.explanation ||
                              "Saved from your earlier culture connections. Explore the official listing to learn more."}
                          </p>
                        </div>
                        <CulturalStory event={event} match={currentMatch}/>
                        <ConnectionNarration eventId={event.id} matchedTags={currentMatch?.matchedTags ?? []} summary={profile.acceptedMemorySummary ?? ""}/>
                        <div className="budget-breakdown">
                          <div>
                            <span>One ticket, from</span>
                            <b>
                              {event.startingPriceSGD === null
                                ? "See official price"
                                : money(event.startingPriceSGD)}
                            </b>
                          </div>
                          {event.startingPriceSGD !== null && (
                            <>
                              <div>
                                <span>Estimated credits applied</span>
                                <span>
                                  {money(
                                    Math.min(
                                      profile.balanceSGD,
                                      event.startingPriceSGD,
                                    ),
                                  )}
                                </span>
                              </div>
                              <div>
                                <span>Estimated cash top-up</span>
                                <b>
                                  {money(
                                    Math.max(
                                      0,
                                      event.startingPriceSGD -
                                        profile.balanceSGD,
                                    ),
                                  )}
                                </b>
                              </div>
                            </>
                          )}
                          <small>
                            Starting tier for one ticket; fees and restrictions
                            may apply. Saving never spends your credits.
                          </small>
                        </div>
                        <div className="detail-actions">
                          <button
                            className={`button ${profile.savedEventIds.includes(event.id) ? "secondary" : "primary"}`}
                            onClick={() => save(event.id)}
                          >
                            {profile.savedEventIds.includes(event.id) ? (
                              <Check size={18} />
                            ) : (
                              <Bookmark size={18} />
                            )}{" "}
                            {profile.savedEventIds.includes(event.id)
                              ? "Saved to My Loop"
                              : "Save to My Loop"}
                          </button>
                          {profile.savedEventIds.includes(event.id) && (
                            <button
                              className="text-button"
                              onClick={() => go("loop")}
                            >
                              See my Loop <ArrowRight size={16} />
                            </button>
                          )}
                          <a
                            className="button outline"
                            href={event.officialListingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            See official event listing{" "}
                            <ExternalLink size={16} />
                          </a>
                        </div>
                        {profile.savedEventIds.includes(event.id) && <JourneyIntent event={event} profile={profile} onChange={value => updateIntent(event.id, value)}/>}
                        <details className="source-details">
                          <summary>
                            <span className="small-dot" />
                            {event.verificationStatus === "verified_eligible"
                              ? "Eligibility source checked (snapshot)"
                              : "Illustrative / unverified"}{" "}
                            · {event.verifiedAt?.slice(0, 10) || "Not verified"}
                          </summary>
                          <p>
                            This is a curated snapshot, not confirmation of
                            tickets or live eligibility.{" "}
                            {"verificationMethod" in event &&
                              (event.verificationMethod ===
                              "indexed-primary-page"
                                ? "Primary-source text retrieved through search indexing; freshness can lag"
                                : "Primary listing read directly")}
                            .
                          </p>
                          {"priceNote" in event && (
                            <p>{String(event.priceNote)}</p>
                          )}
                          <a
                            href={event.officialListingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Check the source <ArrowUpRight size={13} />
                          </a>
                        </details>
                      </div>
                    </div>
                  </section>
                )}
                {screen === "experience" && !event && (
                  <section className="empty-state">
                    <h1 ref={heading} tabIndex={-1}>
                      Pick a connection to explore.
                    </h1>
                    <button
                      className="button primary"
                      onClick={() => go("discover")}
                    >
                      Your constellation <ArrowRight />
                    </button>
                  </section>
                )}
                {screen === "loop" && (
                  <section className="my-loop">
                    <div className="page-title-row">
                      <div>
                        <p className="eyebrow">YOUR CULTURE JOURNEY</p>
                        <h1 ref={heading} tabIndex={-1}>
                          Good experiences.
                          <br />
                          <em>Keep them coming.</em>
                        </h1>
                        <p>
                          A collection of possibilities. Your next chapter is
                          yours to choose.
                        </p>
                      </div>
                      <div className="loop-stamp">
                        <LoopIcon size={45} />
                        <span>
                          {profile.savedEventIds.length} SAVED CHAPTER
                          {profile.savedEventIds.length === 1 ? "" : "S"}
                        </span>
                      </div>
                    </div>
                    <div className="journey-ribbon">
                      <div>
                        <span>01 · YOUR MEMORY</span>
                        <b>
                          {profile.previousTitle ||
                            (profile.previousCategory
                              ? catLabel(profile.previousCategory)
                              : "A story yet to begin")}
                        </b>
                      </div>
                      <ArrowRight />
                      <div>
                        <span>02 · YOUR CURIOSITY</span>
                        <b>
                          {profile.interests.length
                            ? profile.interests
                                .slice(0, 2)
                                .map(label)
                                .join(" + ")
                            : "Open to the unexpected"}
                        </b>
                      </div>
                      <ArrowRight />
                      <div>
                        <span>03 · YOUR NEXT CHAPTER</span>
                        <b>
                          {profile.savedEventIds.length
                            ? "Saved, ready to explore"
                            : "A world of possibilities"}
                        </b>
                      </div>
                    </div>
                    {profile.savedEventIds.length ? (
                      <div className="saved-list">
                        {events
                          .filter((e) => profile.savedEventIds.includes(e.id))
                          .map((e, i) => (
                            <article key={e.id} className="saved-row">
                              <div className="saved-art">
                                <EventCover event={e} />
                              </div>
                              <div className="saved-info">
                                <span className="eyebrow">
                                  CHAPTER {String(i + 1).padStart(2, "0")} ·{" "}
                                  {catLabel(e.category)}
                                </span>
                                <button
                                  className="event-title"
                                  onClick={() => open(e.id)}
                                >
                                  {e.title}
                                </button>
                                <p>
                                  {dateLabel(e)} ·{" "}
                                  {e.startingPriceSGD === null
                                    ? "Price on official site"
                                    : `From ${money(e.startingPriceSGD)}`}
                                </p>
                                <small>
                                  Saved for later · attendance not recorded
                                </small>
                                {!!profile.journeyNotes?.[e.id]?.reason && <p className="saved-intent-label">{profile.journeyNotes[e.id].reason}</p>}
                              </div>
                              <button
                                className="icon-button"
                                onClick={() => save(e.id)}
                                aria-label={`Remove ${e.title}`}
                              >
                                <X size={18} />
                              </button>
                              <button
                                className="round-outline"
                                onClick={() => open(e.id)}
                                aria-label={`Open saved ${e.title}`}
                              >
                                <ArrowUpRight size={21} />
                              </button>
                              <JourneyIntent event={e} profile={profile} onChange={value => updateIntent(e.id, value)}/>
                            </article>
                          ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <Bookmark size={36} strokeWidth={1} />
                        <h2>Your next chapter is still unwritten.</h2>
                        <p>
                          Save an experience that sparks something.
                          <br />
                          It’ll be waiting here when you are.
                        </p>
                        <button
                          className="button primary"
                          onClick={() => go("discover")}
                        >
                          Find a connection <ArrowUpRight size={18} />
                        </button>
                      </div>
                    )}
                    <div className="loop-footer">
                      <button
                        className="button primary"
                        onClick={() => go("dna")}
                      >
                        Keep the loop going <ArrowUpRight size={18} />
                      </button>
                      <p>
                        Your manually entered balance is still{" "}
                        <b>{money(profile.balanceSGD)}</b>.<br />
                        Saving experiences does not spend credits.
                      </p>
                    </div>
                  </section>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
          <div className="notice" role="status" aria-live="polite">
            {notice}
          </div>
          {storageWarning && (
            <p className="storage-warning" role="status">
              Browser storage is unavailable. Your journey works in this tab,
              but cannot be saved after closing it.
            </p>
          )}
          <footer className="site-footer">
            <span>
              <LoopIcon size={18} /> DON'T LET THE EXPERIENCE END THERE.
            </span>
            <p>
              CultureLoop is an independent makeathon prototype, not affiliated
              with or endorsed by SG Culture Pass, MCCY or the Singapore Government.
              Balances are entered by users; credits are not linked or redeemed here.
              Confirm eligibility, prices and availability with the relevant ticketing provider.
            </p>
            <div>
              <a
                href="https://www.sgculturepass.gov.sg/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Official SG Culture Pass <ArrowUpRight size={13} />
              </a>
              <button onClick={() => setResetOpen(true)}>Clear all data</button>
            </div>
          </footer>
          {resetOpen && (
            <div className="modal-backdrop" onClick={() => setResetOpen(false)}>
              <section
                className="reset-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="reset-title"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setResetOpen(false);
                  if (e.key === "Tab") {
                    const buttons = Array.from(
                      e.currentTarget.querySelectorAll("button"),
                    );
                    const first = buttons[0],
                      last = buttons[buttons.length - 1];
                    if (e.shiftKey && document.activeElement === first) {
                      e.preventDefault();
                      last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                      e.preventDefault();
                      first.focus();
                    }
                  }
                }}
              >
                <h2 id="reset-title">Clear this browser’s CultureLoop?</h2>
                <p>
                  This clears your story, tastes and saved experiences on this
                  browser.
                </p>
                <div>
                  <button
                    autoFocus
                    className="button secondary"
                    onClick={() => setResetOpen(false)}
                  >
                    Keep my Loop
                  </button>
                  <button
                    className="button primary"
                    onClick={() => {
                      clearConnectionNarrations();
                      setProfile({ ...defaultProfile, savedEventIds: [] });
                      setResetOpen(false);
                      setAffordable(false);
                      setSurprise(false);
                      go("welcome");
                    }}
                  >
                    Clear all data
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </AtmosphereProvider>
    </MotionConfig>
  );
}
