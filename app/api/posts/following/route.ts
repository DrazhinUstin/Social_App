import { NextRequest } from 'next/server';
import { validateRequest } from '@/auth';
import { prisma } from '@/client';
import { getPostInclude, type PostsWithNextCursor } from '@/app/lib/types';

const postsPerPage = 10;

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return new Response('Unauthorized!', { status: 401 });
    }
    const cursor = request.nextUrl.searchParams.get('cursor');
    const posts = await prisma.post.findMany({
      where: {
        authorId: { not: user.id },
        author: { followedBy: { some: { followedById: user.id } } },
      },
      orderBy: { createdAt: 'desc' },
      cursor: cursor ? { id: cursor } : undefined,
      take: postsPerPage,
      skip: cursor ? 1 : undefined,
      include: getPostInclude(user.id),
    });
    const nextCursor = posts[postsPerPage - 1]?.id ?? null;
    const data: PostsWithNextCursor = { posts, nextCursor };
    return Response.json(data);
  } catch (error) {
    return new Response('Internal server error!', { status: 500 });
  }
}
