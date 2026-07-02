/** Public API types shared by the SDK. Kept independent so the SDK stays
 * publishable without workspace coupling. */

export interface Run402ClientOptions {
  /** Project API key (`key_...`). */
  apiKey: string;
  /** Override the API origin. Defaults to https://api.run402.com. */
  baseUrl?: string;
  /** Custom fetch (for testing / non-browser runtimes). */
  fetch?: typeof fetch;
}

export interface ApiErrorShape {
  error: { code: string; message: string; details?: unknown };
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  status: "active" | "paused" | "archived";
  createdAt: string;
}

export interface ListResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}
