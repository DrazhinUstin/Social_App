import { z } from 'zod';

export const requiredString = z.string().trim().min(1, 'Required');

export const SignUpFormSchema = z.object({
  username: requiredString
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Only latin letters, numbers 0-9, underscore, dash are allowed'),
  email: requiredString.email(),
  password: requiredString.min(6).max(30),
});

export const LoginFormSchema = z.object({
  username: requiredString,
  password: requiredString,
});

export const CreatePostSchema = z.object({
  content: requiredString,
});
