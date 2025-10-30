import { z } from 'zod';

export const loginSchema = z.object({
  login: z
    .string()
    .min(3, "Login must be at least 3 characters")
    .max(50, "Login too long"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name too short"),
  username: z.string().min(3, "Username too short"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(5, "Password must be at least 5 characters")

})

export const updateMeSchema = z.object({
  name: z.string().min(2,'name too short').optional(),
  username: z.string().min(3, "Username too short").optional(),
  email: z.email("Invalid email address").optional(),
  password: z.string().min(5, "Password must be at least 5 characters").optional(),
  confirmPassword: z.string().optional(),
}).refine(
  (data)=>!(data.password!==data.confirmPassword),
  {message: 'Passwords do not match', path:['confirmPassword']}
)