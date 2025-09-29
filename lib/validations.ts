import { z } from "zod/v4";

export const TrainingSessionSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(), // ISO date string "2025-09-28"
});

export const TrainingPlanSchema = z.object({
  chat: z.string(),
  summary: z.string(),
  sessions: z.array(z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
  }))
});