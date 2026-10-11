export interface BudgetEstimate {
  creditApplied: number | null;
  cashTopUp: number | null;
}

/** One ticket's base price; booking fees and eligibility restrictions are excluded. */
export function budget(balance: number, price: number | null): BudgetEstimate {
  if (price === null || !Number.isFinite(price) || price < 0)
    return { creditApplied: null, cashTopUp: null };
  const safeBalance = Number.isFinite(balance)
    ? Math.min(100, Math.max(0, balance))
    : 0;
  return {
    creditApplied: Math.min(safeBalance, price),
    cashTopUp: Math.max(price - safeBalance, 0),
  };
}
