import { getNotificationInclude } from '@/app/lib/types';
import { validateRequest } from '@/auth';
import { prisma } from '@/client';

export async function DELETE(request: Request, { params: { id } }: { params: { id: string } }) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return new Response('Unauthorized!', { status: 401 });
    }
    const deletedNotification = await prisma.notification.delete({
      where: { id },
      include: getNotificationInclude(user.id),
    });
    return Response.json(deletedNotification);
  } catch (error) {
    console.error(error);
    return new Response('Internal server error!', { status: 500 });
  }
}
