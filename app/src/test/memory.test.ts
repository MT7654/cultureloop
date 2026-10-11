import { describe, expect, it } from 'vitest';
import { validateMemory } from '../domain/memory';

describe('Evidence-backed memory interpretation', () => {
  const memory = 'I loved the live jazz and intimate setting, but the crowded venue put me off.';
  const valid = { summary: 'You enjoyed jazz in an intimate setting.', interests: [{ value: 'jazz', evidence: 'live jazz' }], highlights: [{ value: 'atmosphere', evidence: 'intimate setting' }] };
  it('accepts only supported enums and verbatim spans', () => { expect(validateMemory(valid, memory)).toEqual(valid); });
  it('rejects invented evidence, unsupported enums and oversized output', () => {
    expect(validateMemory({ ...valid, interests: [{ value: 'jazz', evidence: 'I love big crowds' }] }, memory)).toBeNull();
    expect(validateMemory({ ...valid, interests: [{ value: 'crowd-size', evidence: 'crowded venue' }] }, memory)).toBeNull();
    expect(validateMemory({ ...valid, summary: 'a'.repeat(241) }, memory)).toBeNull();
  });
  it('keeps empty inference useful without fabricating tastes', () => { expect(validateMemory({ summary: 'You described the venue.', interests: [], highlights: [] }, 'The venue was unusual.')).not.toBeNull(); });
  it('rejects explicitly disliked evidence even when the span is verbatim', () => {
    expect(validateMemory({summary:'Jazz was not for you.',interests:[{value:'jazz',evidence:'jazz'}],highlights:[]},'I disliked jazz but enjoyed theatre.')).toBeNull();
    expect(validateMemory(valid, memory)).not.toBeNull();
  });
});
