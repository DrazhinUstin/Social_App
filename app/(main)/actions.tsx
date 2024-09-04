'use server';

import { validateRequest } from '@/auth';
import { prisma } from '@/client';
import { CreatePostSchema } from '@/app/lib/schemas';
import { revalidatePath } from 'next/cache';

export async function createPost(input: string) {
  const { user } = await validateRequest();
  if (!user) throw Error('Not authorized!');
  const { content } = CreatePostSchema.parse({ content: input });
  try {
    await prisma.post.create({ data: { content, authorId: user.id } });
    revalidatePath('/');
  } catch (error) {
    throw Error('DB Error: Failed to create a post');
  }
}
