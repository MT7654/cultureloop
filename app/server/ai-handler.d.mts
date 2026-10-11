export interface AIHandlerOptions {
  env?: Record<string, string | undefined>;
  getEvent?: (id: string) => unknown;
  fetchImpl?: typeof fetch;
}
/** Supports Node/Vercel and Connect adapters; runtime validates request/body shape. */
export function createAIHandler(options?: AIHandlerOptions): (request: unknown, response: unknown) => Promise<void>;
export function validateInterpretation(data: unknown, memory: string): unknown;
