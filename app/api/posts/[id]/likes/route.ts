import { getPostInclude, type LikesInfo } from '@/app/lib/types';
import { validateRequest } from '@/auth';
import { prisma } from '@/client';

export async function GET(request: Request, { params: { id } }: { params: { id: string } }) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return new Response('Unauthorized!', { status: 401 });
    }
    const post = await prisma.post.findUnique({ where: { id }, include: getPostInclude(user.id) });
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
    await prisma.like.create({ data: { postId: id, userId: user.id } });
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
    await prisma.like.delete({ where: { postId_userId: { postId: id, userId: user.id } } });
    return new Response();
  } catch (error) {
    console.error(error);
    return new Response('Internal server error!', { status: 500 });
  }
}
