'use server';

import { validateRequest } from '@/auth';
import { prisma } from '@/client';
import { z } from 'zod';
import { CreatePostSchema } from '@/app/lib/schemas';
import { getPostInclude } from '@/app/lib/types';

export async function createPost(data: z.infer<typeof CreatePostSchema>) {
  const { user } = await validateRequest();
  if (!user) throw Error('Not authorized!');
  const { content, attachmentIds } = CreatePostSchema.parse(data);
  try {
    const post = await prisma.post.create({
      data: {
        content,
        authorId: user.id,
        attachments: { connect: attachmentIds.map((id) => ({ id })) },
      },
      include: getPostInclude(user.id),
    });
    return post;
  } catch (error) {
    throw Error('DB Error: Failed to create a post');
  }
}

export async function editPost({
  postId,
  data,
}: {
  postId: string;
  data: z.infer<typeof CreatePostSchema>;
}) {
  const { content, attachmentIds } = CreatePostSchema.parse(data);
  const { user } = await validateRequest();
  if (!user) throw Error('Not authorized!');
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { attachments: true },
  });
  if (!post) throw Error('Post not found!');
  try {
    const disconnect = post.attachments
      .filter((a) => !attachmentIds.some((id) => id === a.id))
      .map((a) => ({ id: a.id }));
    const editedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        content,
        attachments: {
          connect: attachmentIds.map((id) => ({ id })),
          disconnect,
        },
      },
      include: getPostInclude(user.id),
    });
    return editedPost;
  } catch (error) {
    throw Error('DB Error: Failed to edit a post');
  }
}

export async function deletePost(postId: string) {
  const { user } = await validateRequest();
  if (!user) throw Error('Not authorized!');
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw Error('Post not found!');
  if (post.authorId !== user.id) throw Error('Not authorized! Only author can delete a post!');
  try {
    const deletedPost = await prisma.post.delete({
      where: { id: postId },
      include: getPostInclude(user.id),
    });
    return deletedPost;
  } catch (error) {
    throw Error('DB Error: Failed to delete a post');
  }
}
