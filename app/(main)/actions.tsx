'use server';

import { validateRequest } from '@/auth';
import { prisma } from '@/client';
import { CreatePostSchema } from '@/app/lib/schemas';
import { postInclude } from '@/app/lib/types';

export async function createPost(input: string) {
  const { user } = await validateRequest();
  if (!user) throw Error('Not authorized!');
  const { content } = CreatePostSchema.parse({ content: input });
  try {
    const post = await prisma.post.create({
      data: { content, authorId: user.id },
      include: postInclude,
    });
    return post;
  } catch (error) {
    throw Error('DB Error: Failed to create a post');
  }
}
