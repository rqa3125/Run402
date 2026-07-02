import { apiHandler } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

/** Lightweight liveness probe. Does not touch the database. */
export const GET = apiHandler(async () => {
  return ok({ status: "ok", service: "dashboard", ts: new Date().toISOString() });
});
