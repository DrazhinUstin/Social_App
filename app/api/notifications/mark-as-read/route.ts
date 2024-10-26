import { validateRequest } from '@/auth';
import { prisma } from '@/client';

export async function PATCH() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return new Response('Unauthorized!', { status: 401 });
    }
    await prisma.notification.updateMany({
      where: { recipientId: user.id, read: false },
      data: { read: true },
    });
    return new Response();
  } catch (error) {
    console.error(error);
    return new Response('Internal server error!', { status: 500 });
  }
}
