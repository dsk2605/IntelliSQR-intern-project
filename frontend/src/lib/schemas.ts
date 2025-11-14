// src/lib/schemas.ts
import { z } from 'zod';

// Schema for the Signup form
export const signupSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // a field to attach the error to
  });

// Schema for the Login form
export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

// We'll also define the types inferred from these schemas
// This is a great TypeScript practice
export type TSignupSchema = z.infer<typeof signupSchema>;
export type TLoginSchema = z.infer<typeof loginSchema>;

// Schema for the Create Todo form
export const todoSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
});

// Type for the todo schema
export type TTodoSchema = z.infer<typeof todoSchema>;

// Schema for the Forgot Password form
export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

// Schema for the Reset Password form
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// New types
export type TForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>;