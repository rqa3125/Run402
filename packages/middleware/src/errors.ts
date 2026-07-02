/**
 * Rich, actionable errors. Every Run402 error explains what happened, why, how
 * to fix it, and links to docs — so failures are self-service.
 */

const DOCS = "https://docs.run402.com";

export interface Run402ErrorOptions {
  code: string;
  what: string;
  why?: string;
  fix?: string;
  /** Docs slug appended to the docs base, e.g. "middleware". */
  docs?: string;
}

export class Run402Error extends Error {
  readonly code: string;
  readonly what: string;
  readonly why?: string;
  readonly fix?: string;
  readonly docsUrl: string;

  constructor(opts: Run402ErrorOptions) {
    super(opts.what);
    this.name = "Run402Error";
    this.code = opts.code;
    this.what = opts.what;
    this.why = opts.why;
    this.fix = opts.fix;
    this.docsUrl = opts.docs ? `${DOCS}/${opts.docs}` : DOCS;
  }

  /** Multi-line, human-friendly rendering for terminals/logs. */
  format(): string {
    const lines = [`✖ run402: ${this.what}`];
    if (this.why) lines.push(`  Why:  ${this.why}`);
    if (this.fix) lines.push(`  Fix:  ${this.fix}`);
    lines.push(`  Docs: ${this.docsUrl}`);
    return lines.join("\n");
  }
}

/** Common, pre-written errors. */
export const errors = {
  missingProjectKey: () =>
    new Run402Error({
      code: "missing_project_key",
      what: "No project key provided.",
      why: "protect() needs a project key to identify your project.",
      fix: 'Pass `projectKey` or set the RUN402_SECRET_KEY environment variable.',
      docs: "configuration",
    }),
  missingEndpoint: () =>
    new Run402Error({
      code: "missing_endpoint",
      what: "No endpoint provided.",
      why: "protect() needs the registered route it is guarding.",
      fix: 'Pass `endpoint`, e.g. protect({ endpoint: "/premium" }).',
      docs: "middleware",
    }),
  subscriptionsUnavailable: () =>
    new Run402Error({
      code: "subscriptions_unavailable",
      what: 'mode: "subscription" is not available yet.',
      why: "Subscriptions arrive with the Stripe integration (Sprint 6).",
      fix: 'Use mode: "payment" (the default) for per-request pricing.',
      docs: "configuration",
    }),
  invalidPrice: (value: unknown) =>
    new Run402Error({
      code: "invalid_price",
      what: `Invalid price: ${JSON.stringify(value)}.`,
      why: "Price must be a positive dollar amount or string like \"$0.50\".",
      fix: 'Use price: "$0.50" or price: 0.5.',
      docs: "configuration",
    }),
};
