import { validateRequest } from '@/auth';
import { prisma } from '@/client';
import type { FollowInfo } from '@/app/lib/types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return new Response('Unauthorized!', { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        followedBy: { where: { followedById: loggedInUser.id } },
        _count: { select: { followedBy: true } },
      },
    });
    if (!user) {
      return new Response('User not Found!', { status: 404 });
    }
    const followInfo: FollowInfo = {
      isFollowedByUser: !!user.followedBy[0],
      followedByCount: user._count.followedBy,
    };
    return Response.json(followInfo);
  } catch (error) {
    return new Response('Internal server error!', { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return new Response('Unauthorized!', { status: 401 });
    }
    await prisma.$transaction([
      prisma.follows.create({ data: { followingId: userId, followedById: loggedInUser.id } }),
      prisma.notification.create({
        data: { recipientId: userId, issuerId: loggedInUser.id, type: 'FOLLOW' },
      }),
    ]);
    return new Response();
  } catch (error) {
    return new Response('Internal server error!', { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return new Response('Unauthorized!', { status: 401 });
    }
    await prisma.$transaction([
      prisma.follows.delete({
        where: { followingId_followedById: { followingId: userId, followedById: loggedInUser.id } },
      }),
      prisma.notification.deleteMany({
        where: { recipientId: userId, issuerId: loggedInUser.id, type: 'FOLLOW' },
      }),
    ]);
    return new Response();
  } catch (error) {
    return new Response('Internal server error!', { status: 500 });
  }
}
