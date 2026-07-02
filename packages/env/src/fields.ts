import { z } from "zod";

/** Reusable env field schemas so every app validates values identically. */

export const nodeEnv = z
  .enum(["development", "test", "production"])
  .default("development");

export const logLevel = z
  .enum(["fatal", "error", "warn", "info", "debug", "trace"])
  .default("info");

export const databaseUrl = z
  .string()
  .url()
  .startsWith("postgres", "Must be a PostgreSQL connection string");

export const url = z.string().url();
export const optionalUrl = z.string().url().optional();
export const nonEmpty = z.string().min(1);
export const optionalString = z.string().optional();

export const paymentsProvider = z.enum(["mock", "stripe"]).default("mock");
