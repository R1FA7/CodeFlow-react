import z from 'zod';

export const codeShareSchema = z.object({
  description: z.string().min(1, "Code cannot be empty").max(5000),
  language: z.enum(['java','py','cpp','javascript']).optional(),
  code: z.string().min(1, "Code is required"),
  stdin: z.string().optional().default('')
});
