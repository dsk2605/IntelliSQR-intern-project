import { z } from 'zod';
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
    path: ['confirmPassword'],
  });


export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});


export type TSignupSchema = z.infer<typeof signupSchema>;
export type TLoginSchema = z.infer<typeof loginSchema>;


export const todoSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
});


export type TTodoSchema = z.infer<typeof todoSchema>;


export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});


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


export type TForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>;