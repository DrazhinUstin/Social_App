import { getPostInclude, type PostsWithNextCursor } from '@/app/lib/types';
import { validateRequest } from '@/auth';
import { prisma } from '@/client';
import { type NextRequest } from 'next/server';

const bookmarksPerPage = 10;

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return new Response('Unauthorized!', { status: 404 });
    }
    const cursor = request.nextUrl.searchParams.get('cursor');
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      select: { id: true, post: { include: getPostInclude(user.id) } },
      orderBy: { bookmarkedAt: 'desc' },
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : undefined,
      take: bookmarksPerPage,
    });
    const data: PostsWithNextCursor = {
      posts: bookmarks.map(({ post }) => post),
      nextCursor: bookmarks[bookmarksPerPage - 1]?.id ?? null,
    };
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return new Response('Internal server error!', { status: 500 });
  }
}
