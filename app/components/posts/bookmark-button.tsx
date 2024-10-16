'use client';

import { useToast } from '@/app/hooks/use-toast';
import { api } from '@/app/lib/api';
import type { BookmarkInfo } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { BookmarkIcon } from 'lucide-react';

export default function BookmarkButton({
  postId,
  initialData,
}: {
  postId: string;
  initialData: BookmarkInfo;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey = ['bookmark-info', postId];

  const { isPending, data } = useQuery({
    queryKey,
    queryFn: () => api(`/api/posts/${postId}/bookmark`).json<BookmarkInfo>(),
    initialData,
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? api.delete(`/api/posts/${postId}/bookmark`)
        : api.post(`/api/posts/${postId}/bookmark`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const prevState = queryClient.getQueryData<BookmarkInfo>(queryKey);
      queryClient.setQueryData<BookmarkInfo>(queryKey, (oldState) => {
        if (!oldState) return oldState;
        return { isBookmarkedByUser: !oldState.isBookmarkedByUser };
      });
      return { prevState };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.prevState);
      toast({
        variant: 'destructive',
        description: 'Sorry, there was an error. Please try again.',
      });
    },
  });

  return (
    <button
      type='button'
      title={`${data.isBookmarkedByUser ? 'Remove from' : 'Add to'} bookmarks`}
      className={cn('text-muted-foreground', data.isBookmarkedByUser && 'text-primary')}
      onClick={() => mutation.mutate()}
      disabled={isPending || mutation.isPending}
    >
      <BookmarkIcon className={cn('size-5', data.isBookmarkedByUser && 'fill-primary')} />
    </button>
  );
}
