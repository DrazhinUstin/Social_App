import { Prisma } from '@prisma/client';

export type PostData = Prisma.PostGetPayload<{
  include: { author: { select: { id: true; username: true; displayName: true; avatarUrl: true } } };
}>;
