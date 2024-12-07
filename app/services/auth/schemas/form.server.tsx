import { z } from "zod";

// TODO: Rework this to have a base schema that the two extend from, omitting data where needed
// TODO: as right now, when a user logs in they will get the password errors

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  rememberMe: z.boolean().default(false),
});

export const registerSchema = loginSchema
  .omit({ rememberMe: true })
  .extend({
    username: z.string().min(3, "Username must be at least 3 characters"),
    confirmPassword: z.string(),
    acceptTOS: z.boolean().refine((val) => val, {
      message: "You must read and agree to our Terms of Service.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
