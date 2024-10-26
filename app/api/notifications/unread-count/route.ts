import { getUnreadNotificationsCount } from '@/app/lib/data';
import { validateRequest } from '@/auth';

export async function GET() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return new Response('Unauthorized!', { status: 401 });
    }
    const count = await getUnreadNotificationsCount(user.id);
    return Response.json(count);
  } catch (error) {
    console.error(error);
    return new Response('Internal server error!', { status: 500 });
  }
}
