import { Prisma, Post } from '@prisma/client';

export const getUserSelect = (loggedInUserId: string) => {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
    followedBy: { where: { followedById: loggedInUserId } },
    _count: { select: { followedBy: true, posts: true } },
  } satisfies Prisma.UserSelect;
};

export const getPostInclude = (loggedInUserId: string) => {
  return {
    author: { select: getUserSelect(loggedInUserId) },
    attachments: true,
    likes: { where: { userId: loggedInUserId } },
    bookmarks: { where: { userId: loggedInUserId } },
    _count: { select: { likes: true } },
  } satisfies Prisma.PostInclude;
};

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserSelect>;
}>;

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostInclude>;
}>;

export type PostsWithNextCursor = {
  posts: PostData[];
  nextCursor: Post['id'] | null;
};

export type FollowInfo = {
  isFollowedByUser: boolean;
  followedByCount: number;
};

export type LikesInfo = {
  isLikedByUser: boolean;
  likesCount: number;
};

export type BookmarkInfo = {
  isBookmarkedByUser: boolean;
};
