import { interestLabels, type Interest } from './types';
import { hasNegatedEvidence } from '../../shared/evidence.mjs';

export const highlightLabels: Record<string, string> = { music: 'The music', story: 'The story', atmosphere: 'The atmosphere', making: 'Making something', learning: 'Learning something', together: 'Time together' };
export interface MemorySuggestion<T extends string = string> { value: T; evidence: string }
export interface MemoryInterpretation { summary: string; interests: MemorySuggestion<Interest>[]; highlights: MemorySuggestion[] }

/** A schema-valid inference still needs exact supporting words from the user's input. */
export function validateMemory(value: unknown, memory: string): MemoryInterpretation | null {
  if (!value || typeof value !== 'object') return null;
  const data = value as Record<string, unknown>;
  if (typeof data.summary !== 'string' || data.summary.length > 240 || !Array.isArray(data.interests) || !Array.isArray(data.highlights)) return null;
  const check = (items: unknown[], allowed: Record<string, string>, max: number): MemorySuggestion[] | null => {
    if (items.length > max) return null;
    const result: MemorySuggestion[] = [];
    for (const item of items) {
      if (!item || typeof item !== 'object') return null;
      const row = item as Record<string, unknown>;
      if (typeof row.value !== 'string' || !Object.hasOwn(allowed, row.value) || typeof row.evidence !== 'string' || row.evidence.length < 2 || row.evidence.length > 120 || !memory.toLowerCase().includes(row.evidence.toLowerCase()) || hasNegatedEvidence(memory, row.evidence)) return null;
      if (!result.some(s => s.value === row.value)) result.push({ value: row.value, evidence: row.evidence });
    }
    return result;
  };
  const interests = check(data.interests, interestLabels, 3);
  const highlights = check(data.highlights, highlightLabels, 2);
  return interests && highlights ? { summary: data.summary, interests: interests as MemorySuggestion<Interest>[], highlights } : null;
}

export async function aiRequest(path: string, body: unknown, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CultureLoop-Request': '1' }, body: JSON.stringify(body), signal });
  if (!response.ok) {
    if (response.status === 429) throw new Error('The AI is taking a breather. Your manual choices still work.');
    if (response.status === 503) throw new Error('AI interpretation is unavailable here. Continue with your own choices.');
    throw new Error('That connection could not be interpreted. Your choices are unchanged.');
  }
  return response.json();
}
