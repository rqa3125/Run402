import { Run402Client } from "./client";
import type { Run402ClientOptions } from "./types";

export { Run402Client, Run402Error } from "./client";
export type * from "./types";

/** Convenience factory: `const run402 = createClient({ apiKey })`. */
export function createClient(options: Run402ClientOptions): Run402Client {
  return new Run402Client(options);
}
