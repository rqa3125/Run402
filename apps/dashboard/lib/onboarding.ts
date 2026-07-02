"use client";

/**
 * Lightweight, client-only onboarding progress tracking. The server derives
 * "created project" and "protected endpoint"; the remaining, purely local
 * actions (copied secret, installed SDK, ran a test) are persisted per-project
 * in localStorage and broadcast so the checklist updates live.
 */

export type OnboardingFlag = "copiedSecret" | "installed" | "tested";

const EVENT = "run402:onboarding";
const storageKey = (projectId: string, flag: OnboardingFlag) =>
  `run402:onb:${projectId}:${flag}`;

export function markOnboarding(projectId: string, flag: OnboardingFlag): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(projectId, flag), "1");
  window.dispatchEvent(new CustomEvent(EVENT));
}

export interface OnboardingFlags {
  copiedSecret: boolean;
  installed: boolean;
  tested: boolean;
}

export function readOnboarding(projectId: string): OnboardingFlags {
  if (typeof window === "undefined") {
    return { copiedSecret: false, installed: false, tested: false };
  }
  const get = (flag: OnboardingFlag) =>
    window.localStorage.getItem(storageKey(projectId, flag)) === "1";
  return {
    copiedSecret: get("copiedSecret"),
    installed: get("installed"),
    tested: get("tested"),
  };
}

/** Subscribe to onboarding changes (same-tab custom event + cross-tab storage). */
export function subscribeOnboarding(listener: () => void): () => void {
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
