import { api } from '@/app/lib/api';
import { google, lucia } from '@/auth';
import { prisma } from '@/client';
import { OAuth2RequestError } from 'arctic';
import { generateIdFromEntropySize } from 'lucia';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const storedState = cookies().get('google_oauth_state')?.value ?? null;
  const storedCode = cookies().get('google_oauth_code')?.value ?? null;

  if (!code || !state || !storedState || !storedCode || state !== storedState) {
    return new Response(null, { status: 400 });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, storedCode);
    const accessToken = tokens.accessToken();

    const googleUser = await api('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).json<{ sub: string; name: string }>();

    const existingUser = await prisma.user.findUnique({ where: { google_id: googleUser.sub } });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/',
        },
      });
    }

    const userId = generateIdFromEntropySize(10);
    const username = googleUser.name.replace(/[^0-9a-zA-Z_-]/g, '') + userId.slice(0, 4);

    await prisma.user.create({
      data: {
        id: userId,
        google_id: googleUser.sub,
        username,
        displayName: googleUser.name,
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    });
  } catch (error) {
    if (error instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
