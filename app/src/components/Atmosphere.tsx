import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useReducedMotion } from "motion/react";
import type { Interest } from "../domain/types";
import { deriveSoundProfile, type SoundProfile } from "../domain/sound-profile";
import "./atmosphere.css";

type SoundMode = "familiar" | "explore";
interface AtmosphereState {
  profile: SoundProfile;
  playing: boolean;
  muted: boolean;
  volume: number;
  mode: SoundMode;
  error: string;
  energyRef: MutableRefObject<number>;
  togglePlayback: () => Promise<void>;
  stop: () => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  setMode: (mode: SoundMode) => void;
  setExplorationInterests: (interests: Interest[]) => void;
}
const AtmosphereContext = createContext<AtmosphereState | null>(null);
const frequency = (note: number) => 440 * 2 ** ((note - 69) / 12);

/** One gesture-started original soundscape shared between discovery and previews. */
export function AtmosphereProvider({
  interests,
  children,
}: {
  interests: Interest[];
  children: ReactNode;
}) {
  const [playing, setPlaying] = useState(false),
    [muted, setMutedState] = useState(false),
    [volume, setVolumeState] = useState(0.75),
    [mode, setModeState] = useState<SoundMode>("familiar"),
    [explorationInterests, setExplorationInterests] = useState<Interest[]>([]),
    [error, setError] = useState("");
  const profile = useMemo(() => {
    const alternative = deriveSoundProfile(explorationInterests);
    return mode === "explore" && alternative.musicInterests.length ? alternative : deriveSoundProfile(interests);
  }, [interests, explorationInterests, mode]);
  const engine = useRef<{
    context: AudioContext;
    master: GainNode;
    timer: ReturnType<typeof setInterval>;
    frame: number;
  } | null>(null);
  const energyRef = useRef(0),
    generation = useRef(0),
    starting = useRef(false),
    pendingContext = useRef<AudioContext | null>(null);
  const preferences = useRef({ profile, muted, volume, mode });
  preferences.current = { profile, muted, volume, mode };
  const release = useCallback(() => {
    generation.current += 1;
    starting.current = false;
    const current = engine.current;
    engine.current = null;
    energyRef.current = 0;
    if (pendingContext.current && pendingContext.current !== current?.context)
      void pendingContext.current.close().catch(() => {});
    pendingContext.current = null;
    if (current) {
      clearInterval(current.timer);
      cancelAnimationFrame(current.frame);
      void current.context.close().catch(() => {});
    }
  }, []);
  const stop = useCallback(() => {
    release();
    setPlaying(false);
  }, [release]);
  useEffect(() => release, [release]);
  const updateGain = useCallback((nextMuted: boolean, nextVolume: number) => {
    const current = engine.current;
    if (!current || current.context.state === "closed") return;
    const time = current.context.currentTime;
    current.master.gain.cancelScheduledValues(time);
    current.master.gain.setTargetAtTime(
      nextMuted ? 0 : nextVolume * 0.9,
      time,
      0.08,
    );
    if (nextMuted || nextVolume === 0) energyRef.current = 0;
  }, []);
  const setMuted = useCallback(
    (value: boolean) => {
      preferences.current.muted = value;
      setMutedState(value);
      updateGain(value, preferences.current.volume);
    },
    [updateGain],
  );
  const setVolume = useCallback(
    (value: number) => {
      const safe = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
      preferences.current.volume = safe;
      setVolumeState(safe);
      updateGain(preferences.current.muted, safe);
    },
    [updateGain],
  );
  const setMode = useCallback(
    (value: SoundMode) => {
      preferences.current.mode = value;
      setModeState(value);
    },
    [],
  );
  const togglePlayback = useCallback(async () => {
    if (engine.current || starting.current) {
      stop();
      return;
    }
    starting.current = true;
    const ticket = ++generation.current;
    let context: AudioContext | undefined;
    try {
      const Audio =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Audio) throw new Error("Audio unavailable");
      context = new Audio();
      pendingContext.current = context;
      await context.resume();
      if (ticket !== generation.current) {
        await context.close().catch(() => {});
        return;
      }
      const ctx = context,
        master = ctx.createGain(),
        analyser = ctx.createAnalyser(),
        limiter = ctx.createDynamicsCompressor(),
        ceiling = ctx.createWaveShaper();
      analyser.fftSize = 256;
      limiter.threshold.value = -8;
      limiter.knee.value = 6;
      limiter.ratio.value = 12;
      limiter.attack.value = 0.003;
      limiter.release.value = 0.25;
      // A final soft ceiling also bounds any unusually dense blend or transition.
      const curve = new Float32Array(2048);
      for (let index = 0; index < curve.length; index++) {
        const input = (index * 2) / (curve.length - 1) - 1;
        curve[index] = Math.tanh(input * 1.15) * 0.9;
      }
      ceiling.curve = curve;
      ceiling.oversample = "2x";
      master.gain.value = preferences.current.muted
        ? 0
        : preferences.current.volume * 0.9;
      master.connect(limiter);
      limiter.connect(ceiling);
      ceiling.connect(analyser);
      analyser.connect(ctx.destination);
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.Q.value = 0.5;
      filter.connect(master);
      const delay = ctx.createDelay(1),
        wet = ctx.createGain();
      delay.delayTime.value = 0.48;
      wet.gain.value = 0.2;
      delay.connect(wet);
      wet.connect(master);
      const activeVoices = new Set<{
        oscillator: OscillatorNode;
        envelope: GainNode;
      }>();
      // Delayed notes have no feedback loop, avoiding runaway or persistent echoes.
      const voice = (
        note: number,
        length: number,
        amplitude: number,
        type: OscillatorType = "sine",
      ) => {
        const oscillator = ctx.createOscillator(),
          envelope = ctx.createGain(),
          now = ctx.currentTime;
        oscillator.type = type;
        oscillator.frequency.value = frequency(note);
        envelope.gain.setValueAtTime(0, now);
        envelope.gain.linearRampToValueAtTime(
          amplitude,
          now + Math.min(0.7, length * 0.2),
        );
        envelope.gain.exponentialRampToValueAtTime(0.0001, now + length);
        oscillator.connect(envelope);
        envelope.connect(filter);
        envelope.connect(delay);
        const currentVoice = { oscillator, envelope };
        activeVoices.add(currentVoice);
        oscillator.onended = () => {
          activeVoices.delete(currentVoice);
          oscillator.disconnect();
          envelope.disconnect();
        };
        oscillator.start(now);
        oscillator.stop(now + length + 0.1);
      };
      let tick = 0,
        soundingProfile = `${preferences.current.profile.key}:${preferences.current.mode}`;
      const melodyIndexes = new Map<string, number>();
      const schedule = () => {
        if (ctx.state !== "running") return;
        const settings = preferences.current,
          mix = settings.profile;
        filter.frequency.setTargetAtTime(mix.tone, ctx.currentTime, 0.6);
        const nextSound = `${mix.key}:${settings.mode}`;
        if (soundingProfile !== nextSound) {
          const time = ctx.currentTime;
          for (const { oscillator, envelope } of activeVoices) {
            if (typeof envelope.gain.cancelAndHoldAtTime === "function")
              envelope.gain.cancelAndHoldAtTime(time);
            else {
              envelope.gain.cancelScheduledValues(time);
              envelope.gain.setValueAtTime(envelope.gain.value, time);
            }
            envelope.gain.linearRampToValueAtTime(0.0001, time + 0.7);
            oscillator.stop(time + 0.8);
          }
          soundingProfile = nextSound;
          tick = 0;
          melodyIndexes.clear();
        }
        // Each selected music taste keeps its harmony, phrase and timbre.
        // Normalized weights prevent selecting more tastes from increasing gain.
        for (const layer of mix.layers) {
          if (tick % 28 === 0)
            layer.chord.forEach((note) =>
              voice(note, layer.padLength, 0.1 * layer.weight),
            );
          if (layer.beats.includes(tick % 8)) {
            const index = melodyIndexes.get(layer.id) ?? 0;
            const note = layer.melody[index % layer.melody.length];
            melodyIndexes.set(layer.id, index + 1);
            voice(
              note + (settings.mode === "explore" ? 12 : 0),
              2.8,
              0.16 * layer.weight,
              settings.mode === "explore" ? "triangle" : layer.melodyWave,
            );
          }
          if (layer.pulse && tick % 2 === 0)
            voice(33, 0.24, 0.075 * layer.weight, "triangle");
        }
        tick += 1;
      };
      schedule();
      const timer = setInterval(schedule, 320),
        values = new Float32Array(analyser.fftSize);
      const state = { context: ctx, master, timer, frame: 0 };
      engine.current = state;
      pendingContext.current = null;
      const measure = () => {
        if (engine.current !== state) return;
        analyser.getFloatTimeDomainData(values);
        const sum = values.reduce(
          (total, sample) => total + sample * sample,
          0,
        );
        energyRef.current =
          preferences.current.muted || preferences.current.volume === 0
            ? 0
            : Math.min(1, Math.sqrt(sum / values.length) * 5);
        state.frame = requestAnimationFrame(measure);
      };
      measure();
      starting.current = false;
      setPlaying(true);
      setError("");
    } catch {
      if (context && context.state !== "closed")
        void context.close().catch(() => {});
      if (ticket === generation.current) {
        stop();
        setError(
          "Sound is unavailable here. You can still explore the visual interpretation.",
        );
      }
    }
  }, [stop]);
  const state = useMemo(
    () => ({
      profile,
      playing,
      muted,
      volume,
      mode,
      error,
      energyRef,
      togglePlayback,
      stop,
      setMuted,
      setVolume,
      setMode,
      setExplorationInterests,
    }),
    [
      profile,
      playing,
      muted,
      volume,
      mode,
      error,
      togglePlayback,
      stop,
      setMuted,
      setVolume,
      setMode,
    ],
  );
  return (
    <AtmosphereContext.Provider value={state}>
      {children}
    </AtmosphereContext.Provider>
  );
}
export function useAtmosphere() {
  const value = useContext(AtmosphereContext);
  if (!value)
    throw new Error("Atmosphere components require AtmosphereProvider.");
  return value;
}
export function SoundMeter({ className = "" }: { className?: string }) {
  const { energyRef, playing, muted } = useAtmosphere(),
    reduced = useReducedMotion(),
    bars = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!playing || muted || reduced) return;
    let frame = 0;
    const update = () => {
      Array.from(bars.current?.children ?? []).forEach((bar, index) => {
        (bar as HTMLElement).style.transform =
          `scaleY(${0.16 + energyRef.current * (0.5 + Math.sin(index * 1.7) * 0.24)})`;
      });
      frame = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(frame);
  }, [energyRef, playing, muted, reduced]);
  return (
    <div
      ref={bars}
      className={`sound-meter ${className} ${playing && !muted && !reduced ? "is-live" : ""}`}
      aria-hidden="true"
    >
      {Array.from({ length: 15 }, (_, index) => (
        <i key={index} />
      ))}
    </div>
  );
}
export function AtmosphereControls() {
  const sound = useAtmosphere();
  return (
    <section className="atmosphere-player" aria-label="CultureLoop atmosphere">
      <SoundMeter />
      <div className="atmosphere-caption">
        <strong>{sound.profile.title}</strong>
        <span>{sound.profile.description}</span>
      </div>
      <button
        className="atmosphere-play"
        onClick={() => void sound.togglePlayback()}
        aria-label={sound.playing ? "Pause atmosphere" : "Play atmosphere"}
      >
        {sound.playing ? (
          <Pause size={17} fill="currentColor" />
        ) : (
          <Play size={17} fill="currentColor" />
        )}
      </button>
      <button
        className="atmosphere-mute"
        onClick={() => sound.setMuted(!sound.muted)}
        aria-label={sound.muted ? "Unmute atmosphere" : "Mute atmosphere"}
      >
        {sound.muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
      </button>
      <label className="atmosphere-volume">
        <span className="audio-sr-only">Atmosphere volume</span>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={Math.round(sound.volume * 100)}
          onChange={(event) =>
            sound.setVolume(Number(event.target.value) / 100)
          }
        />
      </label>
      {sound.error && (
        <p className="atmosphere-error" role="status">
          {sound.error}
        </p>
      )}
    </section>
  );
}
