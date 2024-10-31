import { getPostInclude, type PostsWithNextCursor } from '@/app/lib/types';
import { validateRequest } from '@/auth';
import { prisma } from '@/client';
import type { Prisma } from '@prisma/client';
import { type NextRequest } from 'next/server';

const postsPerPage = 10;

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query');
  const cursor = request.nextUrl.searchParams.get('cursor');
  try {
    const { user } = await validateRequest();
    if (!user) {
      return new Response('Unauthorized!', { status: 401 });
    }
    let where: Prisma.PostWhereInput = {};
    if (query) {
      const search = query.split(' ').join('&');
      where = {
        OR: [
          { content: { search } },
          { author: { username: { search } } },
          { author: { displayName: { search } } },
        ],
      };
    }
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : undefined,
      take: postsPerPage,
      include: getPostInclude(user.id),
    });
    const data: PostsWithNextCursor = {
      posts,
      nextCursor: posts[postsPerPage - 1]?.id ?? null,
    };
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return new Response('Internal server error!', { status: 500 });
  }
}
