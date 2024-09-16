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

export async function deletePost(postId: string) {
  const { user } = await validateRequest();
  if (!user) throw Error('Not authorized!');
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw Error('Post not found!');
  if (post.authorId !== user.id) throw Error('Not authorized! Only author can delete a post!');
  try {
    const deletedPost = await prisma.post.delete({ where: { id: postId }, include: postInclude });
    return deletedPost;
  } catch (error) {
    throw Error('DB Error: Failed to delete a post');
  }
}
