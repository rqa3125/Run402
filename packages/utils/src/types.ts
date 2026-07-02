/** Common utility types shared across the platform. */

/** Flattens intersections for nicer editor hovers. */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type Nullable<T> = T | null;
export type Maybe<T> = T | null | undefined;

/** At least one key of T must be present. */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

/** Cursor-based pagination envelope returned by list endpoints. */
export interface Paginated<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export type SortDirection = "asc" | "desc";
