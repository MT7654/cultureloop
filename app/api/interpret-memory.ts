// Vercel Node function: server-only imports and environment, never bundled into React.
import { createAIHandler } from '../server/ai-handler.mjs';
import { events } from '../src/data/events';
export default createAIHandler({ getEvent: (id: string) => events.find(event => event.id === id) });
