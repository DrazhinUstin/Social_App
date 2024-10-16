import type { BookmarkInfo } from '@/app/lib/types';
import { validateRequest } from '@/auth';
import { prisma } from '@/client';

export async function GET(request: Request, { params: { id } }: { params: { id: string } }) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return new Response('Unauthorized!', { status: 401 });
    }
    const post = await prisma.post.findUnique({
      where: { id },
      select: { bookmarks: { where: { userId: user.id } } },
    });
    if (!post) {
      return new Response('Post not found!', { status: 404 });
    }
    const bookmarkInfo: BookmarkInfo = { isBookmarkedByUser: !!post.bookmarks.length };
    return Response.json(bookmarkInfo);
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
    await prisma.bookmark.create({ data: { postId: id, userId: user.id } });
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
    await prisma.bookmark.delete({ where: { postId_userId: { postId: id, userId: user.id } } });
    return new Response();
  } catch (error) {
    console.error(error);
    return new Response('Internal server error!', { status: 500 });
  }
}
