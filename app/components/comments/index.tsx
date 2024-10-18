'use client';

import { api } from '@/app/lib/api';
import type { CommentsWithNextCursor } from '@/app/lib/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import CommentCard from './comment-card';
import { Button } from '@/app/components/ui/button';
import CreateCommentForm from './create-comment-form';

export default function Comments({ postId }: { postId: string }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam }) =>
      api(
        `/api/posts/${postId}/comments`,
        pageParam ? { searchParams: { cursor: pageParam } } : undefined,
      ).json<CommentsWithNextCursor>(),
    initialPageParam: null as CommentsWithNextCursor['nextCursor'],
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  });

  if (status === 'pending') {
    return <Loader2 className='mx-auto animate-spin' />;
  }

  if (status === 'error') {
    return (
      <p className='text-center text-destructive'>
        Sorry, there was an error. Failed to load comments.
      </p>
    );
  }

  const comments = data.pages.map((page) => page.comments).flat();

  return (
    <div className='space-y-2'>
      <CreateCommentForm postId={postId} />
      {hasNextPage && (
        <div className='text-center'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading previous...' : 'Load previous'}
          </Button>
        </div>
      )}
      <div className='divide-y'>
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
      {comments.length === 0 && (
        <p className='text-center text-muted-foreground'>No comments yet...</p>
      )}
    </div>
  );
}
