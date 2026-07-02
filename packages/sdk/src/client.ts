import type {
  ApiErrorShape,
  ListResponse,
  Project,
  Run402ClientOptions,
} from "./types";

const DEFAULT_BASE_URL = "https://api.run402.com";

export class Run402Error extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "Run402Error";
  }
}

/**
 * Minimal, typed HTTP client. Transport is implemented; resource methods are
 * declared but their server endpoints are not built yet (foundation only).
 */
export class Run402Client {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: Run402ClientOptions) {
    if (!options.apiKey) throw new Error("Run402: `apiKey` is required.");
    this.apiKey = options.apiKey;
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.fetchImpl = options.fetch ?? globalThis.fetch;
  }

  /** Low-level request helper with typed error handling. */
  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await this.fetchImpl(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        authorization: `Bearer ${this.apiKey}`,
        "content-type": "application/json",
        ...init.headers,
      },
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as ApiErrorShape | null;
      throw new Run402Error(
        body?.error?.message ?? res.statusText,
        body?.error?.code ?? "unknown",
        res.status,
      );
    }
    return (await res.json()) as T;
  }

  /** Project resources. Endpoints are not implemented server-side yet. */
  readonly projects = {
    list: (): Promise<ListResponse<Project>> =>
      this.request<ListResponse<Project>>("/v1/projects"),
    get: (id: string): Promise<Project> =>
      this.request<Project>(`/v1/projects/${id}`),
  };
}
