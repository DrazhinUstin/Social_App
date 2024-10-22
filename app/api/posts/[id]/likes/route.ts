import type { LikesInfo } from '@/app/lib/types';
import { validateRequest } from '@/auth';
import { prisma } from '@/client';

export async function GET(request: Request, { params: { id } }: { params: { id: string } }) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return new Response('Unauthorized!', { status: 401 });
    }
    const post = await prisma.post.findUnique({
      where: { id },
      select: { likes: { where: { userId: user.id } }, _count: { select: { likes: true } } },
    });
    if (!post) {
      return new Response('Post not found!', { status: 404 });
    }
    const likesInfo: LikesInfo = {
      isLikedByUser: !!post.likes.length,
      likesCount: post._count.likes,
    };
    return Response.json(likesInfo);
  } catch (error) {
    console.error(error);
    return new Response('Internal server error!', { status: 500 });
  }
}

export async function POST(request: Request, { params: { id } }: { params: { id: string } }) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return new Response('Unauthorized!', { status: 401 });
    }
    const post = await prisma.post.findUnique({ where: { id }, select: { authorId: true } });
    if (!post) {
      return new Response('Post not found!', { status: 404 });
    }
    await prisma.$transaction([
      prisma.like.create({ data: { postId: id, userId: user.id } }),
      ...(user.id !== post.authorId
        ? [
            prisma.notification.create({
              data: { postId: id, issuerId: user.id, recipientId: post.authorId, type: 'LIKE' },
            }),
          ]
        : []),
    ]);
    return new Response();
  } catch (error) {
    console.error(error);
    return new Response('Internal server error!', { status: 500 });
  }
}

export async function DELETE(request: Request, { params: { id } }: { params: { id: string } }) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return new Response('Unauthorized!', { status: 401 });
    }
    await prisma.$transaction([
      prisma.like.delete({ where: { postId_userId: { postId: id, userId: user.id } } }),
      prisma.notification.deleteMany({ where: { postId: id, issuerId: user.id, type: 'LIKE' } }),
    ]);
    return new Response();
  } catch (error) {
    console.error(error);
    return new Response('Internal server error!', { status: 500 });
  }
}
