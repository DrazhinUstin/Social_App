import { prisma } from '@/client';
import { cache } from 'react';
import { getUserSelect } from '@/app/lib/types';

export const getUserById = cache((userId: string, loggedInUserId: string) => {
  try {
    const user = prisma.user.findUnique({
      where: { id: userId },
      select: getUserSelect(loggedInUserId),
    });
    return user;
  } catch (error) {
    console.error(error);
    throw Error('Database Error: Failed to fetch a user');
  }
});
