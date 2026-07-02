import { z } from "zod";

/** Supported currencies for per-request pricing. */
export const CURRENCIES = ["usd", "eur", "gbp"] as const;

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be 60 characters or fewer"),
  description: z
    .string()
    .trim()
    .max(280, "Keep it under 280 characters")
    .optional(),
  currency: z.enum(CURRENCIES).default("usd"),
  // Dollar amount per request; coerced from the form's string input.
  pricePerRequest: z.coerce
    .number()
    .min(0, "Price cannot be negative")
    .max(1000, "Price is unrealistically high"),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

/** Settings edit uses the same shape as creation. */
export const updateProjectSchema = createProjectSchema;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
