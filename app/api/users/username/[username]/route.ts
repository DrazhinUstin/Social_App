import { getUserSelect } from '@/app/lib/types';
import { validateRequest } from '@/auth';
import { prisma } from '@/client';

export async function GET(
  request: Request,
  { params: { username } }: { params: { username: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return new Response('Unauthorized!', { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { username },
      select: getUserSelect(loggedInUser.id),
    });
    if (!user) {
      return new Response('User does not found!', { status: 404 });
    }
    return Response.json(user);
  } catch (error) {
    return new Response('Internal server error!', { status: 500 });
  }
}
