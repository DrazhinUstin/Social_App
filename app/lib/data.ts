import { prisma } from '@/client';
import { cache } from 'react';
import { getUserSelect, getPostInclude } from '@/app/lib/types';

export const getUserById = cache(async (userId: string, loggedInUserId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: getUserSelect(loggedInUserId),
    });
    return user;
  } catch (error) {
    console.error(error);
    throw Error('Database Error: Failed to fetch a user');
  }
});

export const getPostById = cache(async (postId: string, loggedInUserId: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: getPostInclude(loggedInUserId),
    });
    return post;
  } catch (error) {
    console.error(error);
    throw Error('Database Error: Failed to fetch a post');
  }
});
