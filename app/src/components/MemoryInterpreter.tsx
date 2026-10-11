import { useEffect, useRef, useState } from 'react';
import { Sparkles, Check, X } from 'lucide-react';
import { interestLabels } from '../domain/types';
import { aiRequest, highlightLabels, validateMemory, type MemoryInterpretation } from '../domain/memory';
import './memory-ai.css';

export function MemoryInterpreter({ onAccept, selectionKey }: { onAccept: (result: MemoryInterpretation) => void; selectionKey: string }) {
  const [memory, setMemory] = useState('');
  const [result, setResult] = useState<MemoryInterpretation | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const abort = useRef<AbortController | null>(null);
  const version = useRef(0);
  const cancel = () => { version.current++; abort.current?.abort(); setBusy(false); setResult(null); };
  useEffect(() => { cancel(); setStatus(''); return () => { version.current++; abort.current?.abort(); }; }, [selectionKey]);
  const interpret = async () => {
    cancel(); const requestId = version.current; const controller = new AbortController(); abort.current = controller;
    setBusy(true); setStatus('Finding words for what stayed with you…');
    const timer = window.setTimeout(() => controller.abort(), 10000);
    try {
      const value = await aiRequest('/api/interpret-memory', { memory: memory.trim() }, controller.signal);
      if (requestId !== version.current) return;
      const parsed = validateMemory(value, memory.trim());
      if (!parsed) throw new Error('The suggestion was not supported by your words. Continue with your own choices.');
      setResult(parsed); setStatus(parsed.interests.length || parsed.highlights.length ? 'Review these suggestions. Nothing changes until you accept.' : 'No supported tastes found. Keep exploring with your own choices.');
    } catch (error) {
      if (requestId !== version.current) return;
      setStatus(error instanceof Error && error.name !== 'AbortError' ? error.message : 'This took too long. Continue with your own choices.');
    } finally { window.clearTimeout(timer); if (requestId === version.current) setBusy(false); }
  };
  return <section className="memory-interpreter" aria-label="Optional AI memory interpretation">
    <div className="memory-heading"><Sparkles size={19} /><strong>Make it personal.</strong><span>Optional</span></div>
    <label htmlFor="culture-memory">Tell us what stayed with you</label>
    <textarea id="culture-memory" maxLength={600} value={memory} placeholder="I loved the live jazz and intimate setting, but the crowded venue put me off…" onChange={e => { cancel(); setMemory(e.target.value); setStatus(''); }} rows={3} />
    <div className="memory-disclosure">Pressing Find my connections sends this text to OpenAI. Leave out personal details. You can always choose tastes yourself.</div>
    <button type="button" className="button secondary memory-action" disabled={busy || memory.trim().length < 3} onClick={interpret}><Sparkles size={17} />{busy ? 'Finding connections…' : 'Find my connections'}</button>
    <p className="memory-status" role="status">{status}</p>
    {result && <div className="memory-result"><span className="memory-ai-label">AI suggestions · review before applying</span><p>{result.summary}</p><div className="memory-suggestions">{result.interests.map(item => <button type="button" className="memory-suggestion" key={item.value} aria-label={`Remove suggested ${interestLabels[item.value]}`} onClick={() => setResult({ ...result, interests: result.interests.filter(row => row.value !== item.value) })}><strong>{interestLabels[item.value]}</strong><q>{item.evidence}</q><X size={15} /></button>)}{result.highlights.map(item => <button type="button" className="memory-suggestion" key={item.value} aria-label={`Remove suggested ${highlightLabels[item.value]}`} onClick={() => setResult({ ...result, highlights: result.highlights.filter(row => row.value !== item.value) })}><strong>{highlightLabels[item.value]}</strong><q>{item.evidence}</q><X size={15} /></button>)}</div><div className="memory-result-actions"><button type="button" className="button primary" onClick={() => { onAccept(result); cancel(); setStatus('Accepted. You can adjust your tastes in the next step.'); }}><Check size={17} />Use these connections</button><button type="button" className="text-button" onClick={() => { cancel(); setStatus('Dismissed. Your choices are unchanged.'); }}>Keep my choices</button></div></div>}
  </section>;
}
