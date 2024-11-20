import { streamServerClient } from '@/app/lib/stream';
import { validateRequest } from '@/auth';

export async function GET() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return new Response('Unauthorized!', { status: 401 });
    }
    const expireTime = Math.floor(Date.now() / 1000) + 60 * 60;
    const issuedAt = Math.floor(Date.now() / 1000) - 60;
    const token = streamServerClient.createToken(user.id, expireTime, issuedAt);
    return Response.json({ token });
  } catch (error) {
    return new Response('Internal server error!', { status: 500 });
  }
}
