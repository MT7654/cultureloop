import { useEffect, useRef, useState } from 'react';
import type { Interest } from '../domain/types';
import { aiRequest } from '../domain/memory';
import './memory-ai.css';

const sessionNarrations = new Map<string, string>();
export const clearConnectionNarrations = () => sessionNarrations.clear();

export function ConnectionNarration({ eventId, matchedTags, summary }: { eventId: string; matchedTags: Interest[]; summary: string }) {
  const [text, setText] = useState(''); const [status, setStatus] = useState(''); const [busy, setBusy] = useState(false);
  const abort = useRef<AbortController | null>(null); const version = useRef(0);
  const tagKey = matchedTags.join('|');
  const cacheKey = JSON.stringify([eventId, summary, tagKey]);
  useEffect(() => { version.current++; abort.current?.abort(); setText(sessionNarrations.get(cacheKey) ?? ''); setStatus(''); setBusy(false); return () => { version.current++; abort.current?.abort(); }; }, [cacheKey]);
  if (!summary || !matchedTags.length) return null;
  const narrate = async () => {
    const requestId = ++version.current; const controller = new AbortController(); abort.current = controller;
    setBusy(true); setStatus('Following your connection…'); const timer = window.setTimeout(() => controller.abort(), 10000);
    try { const data = await aiRequest('/api/narrate-connection', { eventId, matchedTags, summary }, controller.signal) as { eventId?: string; text?: string };
      if (requestId !== version.current) return;
      if (data.eventId !== eventId || typeof data.text !== 'string' || data.text.length > 1000) throw new Error('Your original match explanation is still available.');
      if(sessionNarrations.size >= 30) sessionNarrations.delete(sessionNarrations.keys().next().value!);
      sessionNarrations.set(cacheKey, data.text);
      setText(data.text); setStatus('');
    } catch (error) { if (requestId === version.current) setStatus(error instanceof Error && error.name !== 'AbortError' ? error.message : 'This took too long. Your original match explanation is still available.'); }
    finally { window.clearTimeout(timer); if (requestId === version.current) setBusy(false); }
  };
  return <section className="connection-narration"><span className="memory-ai-label">Your accepted memory, connected</span>{text ? <><p>{text}</p><small>AI-selected connections from verified programme notes. No event facts are generated.</small></> : <><button type="button" className="button secondary" disabled={busy} onClick={narrate}>{busy ? 'Following your connection…' : 'Connect this to my story'}</button><small>Optional: sends your accepted summary and selected connection to OpenAI.</small></>}<p role="status">{status}</p></section>;
}
