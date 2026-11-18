import { z } from "zod";

export const updateScoringWeightsSchema = z
  .object({
    newCustomer: z.number().int().min(0).max(100),
    commercialInterest: z.number().int().min(0).max(100),
    source: z.number().int().min(0).max(100),
    age: z.number().int().min(0).max(100),
  })
  .refine(
    (weights) =>
      weights.newCustomer +
        weights.commercialInterest +
        weights.source +
        weights.age ===
      100,
    {
      message: "Scoring weights must sum exactly 100",
    }
  );

export type UpdateScoringWeightsInput =
  z.infer<typeof updateScoringWeightsSchema>;