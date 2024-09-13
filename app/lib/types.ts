import { Prisma, Post } from '@prisma/client';

export const userSelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

export const postInclude = {
  author: { select: userSelect },
} satisfies Prisma.PostInclude;

export type PostData = Prisma.PostGetPayload<{
  include: typeof postInclude;
}>;

export type PostsWithNextCursor = {
  posts: PostData[];
  nextCursor: Post['id'] | null;
};
