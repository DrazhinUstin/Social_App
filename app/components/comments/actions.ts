'use server';

import { CreateCommentSchema } from '@/app/lib/schemas';
import { getCommentInclude } from '@/app/lib/types';
import { validateRequest } from '@/auth';
import { prisma } from '@/client';

export async function createComment({ input, postId }: { input: string; postId: string }) {
  const { content } = CreateCommentSchema.parse({ content: input });
  const { user } = await validateRequest();
  if (!user) throw Error('Unauthorized!');
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
  if (!post) throw Error('Post not found!');
  try {
    const [comment] = await prisma.$transaction([
      prisma.comment.create({
        data: { userId: user.id, postId, content },
        include: getCommentInclude(user.id),
      }),
      ...(user.id !== post.authorId
        ? [
            prisma.notification.create({
              data: { issuerId: user.id, recipientId: post.authorId, postId, type: 'COMMENT' },
            }),
          ]
        : []),
    ]);
    return comment;
  } catch (error) {
    console.error(error);
    throw Error('Database error: Failed to create a comment!');
  }
}

export async function editComment({ input, commentId }: { input: string; commentId: string }) {
  const { content } = CreateCommentSchema.parse({ content: input });
  const { user } = await validateRequest();
  if (!user) throw Error('Unauthorized!');
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) throw Error('Comment not found!');
  if (user.id !== comment.userId) throw Error('Unauthorized!');
  try {
    const editedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: getCommentInclude(user.id),
    });
    return editedComment;
  } catch (error) {
    console.error(error);
    throw Error('Database error: Failed to edit a comment!');
  }
}

export async function deleteComment(commentId: string) {
  const { user } = await validateRequest();
  if (!user) throw Error('Unauthorized!');
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) throw Error('Comment not found!');
  if (user.id !== comment.userId) throw Error('Unauthorized!');
  try {
    const deletedComment = await prisma.comment.delete({
      where: { id: commentId },
      include: getCommentInclude(user.id),
    });
    return deletedComment;
  } catch (error) {
    console.error(error);
    throw Error('Database error: Failed to delete a comment!');
  }
}
