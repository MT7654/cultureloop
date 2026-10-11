import { useId } from "react";
import { Bookmark, ArrowRight } from "lucide-react";
import { interestLabels, type CultureEvent, type CultureProfile } from "../domain/types";

export default function JourneyIntent({ event, profile, onChange }: {
  event: CultureEvent;
  profile: CultureProfile;
  onChange: (value: { reason: string; note: string }) => void;
}) {
  const id = useId();
  const value = profile.journeyNotes?.[event.id] ?? { reason: "", note: "" };
  const matching = profile.interests.filter(tag => event.tags.includes(tag) || (event.bridgeFromTags.includes(tag) && event.bridgeExplanations[tag]));
  const reasons = [...matching.map(tag => `Following ${interestLabels[tag]}`), "Something new", "Time together", "The artistic format"];
  return <details className="journey-intent" open={undefined}>
    <summary><Bookmark size={16} /> {value.reason || value.note ? "Your reason to go" : "What sparked your curiosity?"}<span aria-hidden="true">+</span></summary>
    {(value.reason || value.note) && <p className="intent-summary">{value.reason}{value.reason && value.note ? " · " : ""}{value.note}</p>}
    <div className="intent-editor">
      <p>A little reminder for your future self.</p>
      <div className="chip-row">{reasons.map(reason => <button key={reason} className={`chip ${value.reason === reason ? "selected" : ""}`} aria-pressed={value.reason === reason} onClick={() => onChange({ ...value, reason: value.reason === reason ? "" : reason })}>{reason}</button>)}</div>
      <label htmlFor={id}>Your note <span>optional</span></label>
      <textarea id={id} maxLength={280} value={value.note} placeholder="What would you like to discover?" onChange={e => onChange({ ...value, note: e.target.value })} />
      <div className="intent-editor-footer"><small>Saved on this device · {value.note.length}/280</small>{(value.reason || value.note) && <button className="text-button" onClick={() => onChange({ reason: "", note: "" })}>Clear this note <ArrowRight size={14}/></button>}</div>
    </div>
  </details>;
}
