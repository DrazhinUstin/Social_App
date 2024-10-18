import { type CommentsWithNextCursor, getCommentInclude } from '@/app/lib/types';
import { validateRequest } from '@/auth';
import { prisma } from '@/client';
import { type NextRequest } from 'next/server';

const commentsPerPage = 5;

export async function GET(request: NextRequest, { params: { id } }: { params: { id: string } }) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return new Response('Unauthorized!', { status: 401 });
    }
    const cursor = request.nextUrl.searchParams.get('cursor');
    const comments = await prisma.comment.findMany({
      where: { postId: id },
      include: getCommentInclude(user.id),
      orderBy: { createdAt: 'asc' },
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : undefined,
      take: -commentsPerPage,
    });
    const data: CommentsWithNextCursor = {
      comments,
      nextCursor: comments.length === commentsPerPage ? comments[0].id : null,
    };
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return new Response('Internal server error!', { status: 500 });
  }
}
