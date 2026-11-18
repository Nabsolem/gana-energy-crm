import { z } from "zod";

export const leadStatusSchema = z.enum([
    "NEW",
    "IN_PROGRESS",
    "CONTACTED",
    "CLOSED",
]);

export const createLeadSchema = z.object({
    name: z.string().trim().min(1).max(100),

    phone: z.string().trim().min(6).max(20),

    isNewCustomer: z.boolean(),

    commercialInterest: z
        .number()
        .int()
        .min(0)
        .max(100),

    source: z.string().trim().min(1).max(100),

    leadDate: z.coerce.date(),
});

export const updateLeadSchema = z.object({
    name: z.string().trim().min(1).max(100).optional(),

    phone: z.string().trim().min(6).max(20).optional(),

    isNewCustomer: z.boolean().optional(),

    commercialInterest: z
        .number()
        .int()
        .min(0)
        .max(100)
        .optional(),

    source: z.string().trim().min(1).max(100).optional(),

    leadDate: z.coerce.date().optional(),

    version: z.number().int().positive(),
});

export const updateLeadStatusSchema = z.object({
    status: leadStatusSchema,

    version: z.number().int().positive(),
});

export const leadIdSchema = z.coerce.number().int().positive();

export type CreateLeadInput =
    z.infer<typeof createLeadSchema>;

export type UpdateLeadInput =
    z.infer<typeof updateLeadSchema>;

export type UpdateLeadStatusInput =
    z.infer<typeof updateLeadStatusSchema>;

export const assignLeadSchema = z.object({
  version: z.number().int().positive(),
});

export const listLeadsQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .positive()
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(20),

  search: z
    .string()
    .trim()
    .optional(),

  status: leadStatusSchema.optional(),

  agentId: z.coerce
    .number()
    .int()
    .positive()
    .optional(),

  sortBy: z
    .enum([
      "createdAt",
      "updatedAt",
      "name",
      "score",
    ])
    .default("createdAt"),

  sortOrder: z
    .enum(["asc", "desc"])
    .default("desc"),
});

export type ListLeadsQuery =
  z.infer<typeof listLeadsQuerySchema>;