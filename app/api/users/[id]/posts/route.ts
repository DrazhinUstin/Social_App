import { NextRequest } from 'next/server';
import { validateRequest } from '@/auth';
import { prisma } from '@/client';
import { getPostInclude, type PostsWithNextCursor } from '@/app/lib/types';

const postsPerPage = 10;

export async function GET(
  request: NextRequest,
  { params: { id: userId } }: { params: { id: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return new Response('Unauthorized!', { status: 401 });
    }
    const cursor = request.nextUrl.searchParams.get('cursor');
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      cursor: cursor ? { id: cursor } : undefined,
      take: postsPerPage,
      skip: cursor ? 1 : undefined,
      include: getPostInclude(loggedInUser.id),
    });
    const nextCursor = posts[postsPerPage - 1]?.id ?? null;
    const data: PostsWithNextCursor = { posts, nextCursor };
    return Response.json(data);
  } catch (error) {
    return new Response('Internal server error!', { status: 500 });
  }
}
