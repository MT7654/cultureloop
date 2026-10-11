/** Conservative clause check; catches explicit dislike, not all linguistic ambiguity. */
export function hasNegatedEvidence(memory, evidence) {
  const clauses = memory.toLowerCase().replace(/[’]/g,"'").split(/\b(?:but|however|yet|although)\b|[,.!?;\n]/);
  const needle = evidence.toLowerCase().replace(/[’]/g,"'").trim();
  const containing = clauses.filter(clause => clause.includes(needle));
  return containing.length > 0 && containing.every(clause => /\b(?:disliked?|hated?|boring|unpleasant|avoid(?:ed)?|not for me)\b|\b(?:didn't|did not|don't|do not|wasn't|was not|not)\s+(?:really\s+)?(?:like|enjoy|into)|put me off/.test(clause));
}
