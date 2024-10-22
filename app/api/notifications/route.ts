import { type NextRequest } from 'next/server';
import { validateRequest } from '@/auth';
import { prisma } from '@/client';
import { getNotificationInclude, type NotificationsWithNextCursor } from '@/app/lib/types';

const notificationsPerPage = 10;

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return new Response('Unauthorized!', { status: 401 });
    }
    const cursor = request.nextUrl.searchParams.get('cursor');
    const notifications = await prisma.notification.findMany({
      where: { recipientId: user.id },
      include: getNotificationInclude(user.id),
      orderBy: { createdAt: 'desc' },
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : undefined,
      take: notificationsPerPage,
    });
    const data: NotificationsWithNextCursor = {
      notifications,
      nextCursor: notifications[notificationsPerPage - 1]?.id ?? null,
    };
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return new Response('Internal server error!', { status: 500 });
  }
}
