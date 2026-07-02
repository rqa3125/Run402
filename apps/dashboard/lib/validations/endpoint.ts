import { z } from "zod";

export const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;
export const ENVIRONMENTS = ["sandbox", "live"] as const;

export const createEndpointSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be 60 characters or fewer"),
  description: z.string().trim().max(280, "Keep it under 280 characters").optional(),
  method: z.enum(HTTP_METHODS).default("GET"),
  path: z
    .string()
    .trim()
    .min(1, "Route is required")
    .max(200)
    .regex(/^\//, "Route must start with /"),
  // Dollar amount per request; coerced from the form's string input.
  price: z.coerce.number().min(0, "Price cannot be negative").max(1000),
  // Only sandbox is selectable for now; live is disabled in the UI.
  environment: z.enum(ENVIRONMENTS).default("sandbox"),
});

export type CreateEndpointInput = z.infer<typeof createEndpointSchema>;

export const updateEndpointSchema = createEndpointSchema;
export type UpdateEndpointInput = z.infer<typeof updateEndpointSchema>;
