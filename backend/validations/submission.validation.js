import { z } from "zod";

export const submissionSchema = z.object({
  code: z.string().min(1, "Code cannot be empty"),
  language: z.enum(["java", "cpp", "py", "js"]),
  problem: z.string().length(24, "Invalid ObjectId").optional(),
  contest: z.string().length(24, "Invalid ObjectId").optional(),
  // submittedAt: z.date().optional(),
  // submittedBy: z.string().length(24, "Invalid ObjectId"),
  message: z.string().optional(),
})


export const playgroundSubmissionSchema = z.object({
  code: z.string().min(1),
  language: z.string().min(1),
  problem: z.string().optional(),
  input: z.string().optional().default(''),
});