'use server';

import { z } from 'zod';
import { EditProfileSchema } from '@/app/lib/schemas';
import { validateRequest } from '@/auth';
import { prisma } from '@/client';
import { getUserSelect } from '@/app/lib/types';
import { streamServerClient } from '@/app/lib/stream';

export async function editProfile(values: z.infer<typeof EditProfileSchema>) {
  const validatedFields = EditProfileSchema.parse(values);
  const { user } = await validateRequest();
  if (!user) throw Error('Not authorized!');
  try {
    const data = await prisma.$transaction(async () => {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { ...validatedFields },
        select: getUserSelect(user.id),
      });
      await streamServerClient.partialUpdateUser({
        id: user.id,
        set: { name: validatedFields.displayName },
      });
      return updatedUser;
    });
    return data;
  } catch (error) {
    throw Error('Database error: Failed to edit user profile');
  }
}
