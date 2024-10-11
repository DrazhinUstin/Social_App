import type { NextRequest } from 'next/server';
import { prisma } from '@/client';
import { UTApi } from 'uploadthing/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }
  try {
    const mediaToDelete = await prisma.media.findMany({
      where: {
        postId: null,
        ...(process.env.NODE_ENV === 'production'
          ? { createdAt: { lte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000) } }
          : {}),
      },
    });
    await new UTApi().deleteFiles(
      mediaToDelete.map(({ url }) => url.split(`${process.env.NEXT_PUBLIC_APP_ID}/`)[1]),
    );
    await prisma.media.deleteMany({ where: { id: { in: mediaToDelete.map(({ id }) => id) } } });
    return new Response();
  } catch (error) {
    return new Response('Internal server error!', { status: 500 });
  }
}
