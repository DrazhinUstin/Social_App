'use server';

import { prisma } from '@/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { hash, verify } from '@node-rs/argon2';
import { lucia, validateRequest } from '@/auth';
import { generateIdFromEntropySize } from 'lucia';
import { z } from 'zod';
import { SignUpFormSchema, LoginFormSchema } from '@/app/lib/schemas';

export async function signUp(values: z.infer<typeof SignUpFormSchema>): Promise<{ error: string }> {
  const validatedFields = SignUpFormSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Failed to sign up: Invalid fields' };
  }
  const { username, email, password } = validatedFields.data;
  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  const userId = generateIdFromEntropySize(10);
  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) {
    return { error: 'Failed to sign up: Username already exist' };
  }
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    return { error: 'Failed to sign up: Email already exist' };
  }
  await prisma.user.create({ data: { id: userId, password_hash: passwordHash, username, email } });
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return redirect('/');
}

export async function login(values: z.infer<typeof LoginFormSchema>): Promise<{ error: string }> {
  const validatedFields = LoginFormSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: 'Failed to login: Invalid fields' };
  }
  const { username, password } = validatedFields.data;
  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (!existingUser?.password_hash) {
    return { error: 'Failed to login: Incorrect username or password' };
  }
  const isValidPassword = await verify(existingUser.password_hash, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  if (!isValidPassword) {
    return {
      error: 'Incorrect username or password',
    };
  }
  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return redirect('/');
}

export async function logout(): Promise<{ error: string }> {
  'use server';
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: 'Unauthorized',
    };
  }
  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  return redirect('/login');
}
