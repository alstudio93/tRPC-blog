import { z } from "zod";

export const createPostValidation = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(1).max(10000).trim(),
});