import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useEffect } from "react";
import EventCover from "./EventCover";
import type { CultureEvent } from "../domain/types";
import { SoundMeter, useAtmosphere } from "./Atmosphere";

export default function AudioPreview({
  category,
  event,
}: {
  category: string;
  event?: CultureEvent;
}) {
  const sound = useAtmosphere();
  const { setExplorationInterests, setMode } = sound;
  useEffect(() => {
    setExplorationInterests(event?.tags ?? []);
    return () => { setExplorationInterests([]); setMode("familiar"); };
  }, [event?.id, event?.tags, setExplorationInterests, setMode]);
  return (
    <section className="sonic-preview immersive-sound-preview">
      <div className="sonic-cover">
        <EventCover event={event} kind={category} />
      </div>
      <div className="sonic-stamp">
        <span>THE CULTURELOOP MIX</span>
        <SoundMeter />
      </div>
      <div className="preview-label">
        <span className="eyebrow">FEEL THE CONNECTION</span>
        <h3>A different frequency.</h3>
        <p>
          {sound.profile.title} · {sound.profile.description}
        </p>
      </div>
      <div className="audio-console">
        <div className="audio-controls">
          <button
            className="round-button"
            onClick={() => void sound.togglePlayback()}
            aria-label={
              sound.playing ? "Pause interpretation" : "Play interpretation"
            }
          >
            {sound.playing ? (
              <Pause size={21} fill="currentColor" />
            ) : (
              <Play size={21} fill="currentColor" />
            )}
          </button>
          <span>
            {sound.playing ? (sound.mode === "explore" ? "Playing a new connection" : "Playing your mix") : "Press play. Hear your mix."}
            <small>Original synthesis · no event recording</small>
          </span>
          <button
            className="icon-button"
            aria-label={
              sound.muted ? "Unmute interpretation" : "Mute interpretation"
            }
            onClick={() => sound.setMuted(!sound.muted)}
          >
            {sound.muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
        <div className="preview-volume">
          <label htmlFor="interpretation-volume">Volume</label>
          <input
            id="interpretation-volume"
            aria-label="Interpretation volume"
            type="range"
            min="0"
            max="100"
            step="1"
            value={Math.round(sound.volume * 100)}
            onChange={(e) => sound.setVolume(Number(e.target.value) / 100)}
          />
          <span>{Math.round(sound.volume * 100)}%</span>
        </div>
        <div className="sound-modes">
          <button
            aria-pressed={sound.mode === "familiar"}
            onClick={() => sound.setMode("familiar")}
          >
            Your taste
          </button>
          <button
            aria-pressed={sound.mode === "explore"}
            onClick={() => sound.setMode("explore")}
          >
            A new sound
          </button>
        </div>
      </div>
      <p className="interpretation">
        Creative interpretation — not actual event audio or imagery.
      </p>
      {sound.error && (
        <p className="atmosphere-error" role="status">
          {sound.error}
        </p>
      )}
    </section>
  );
}
