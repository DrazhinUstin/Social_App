'use client';

import { useToast } from '@/app/hooks/use-toast';
import { api } from '@/app/lib/api';
import type { LikesInfo } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';
import { useQueryClient, useQuery, useMutation, type QueryKey } from '@tanstack/react-query';
import { ThumbsUpIcon } from 'lucide-react';

export default function LikeButton({
  postId,
  initialData,
}: {
  postId: string;
  initialData: LikesInfo;
}) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const queryKey: QueryKey = ['likes-info', postId];

  const { isPending, data } = useQuery({
    queryKey,
    queryFn: () => api(`/api/posts/${postId}/likes`).json<LikesInfo>(),
    initialData,
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? api.delete(`/api/posts/${postId}/likes`)
        : api.post(`/api/posts/${postId}/likes`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const prevState = queryClient.getQueryData<LikesInfo>(queryKey);
      queryClient.setQueryData<LikesInfo>(queryKey, (oldData) => {
        if (!oldData) return oldData;
        return {
          isLikedByUser: !oldData.isLikedByUser,
          likesCount: oldData.likesCount + (oldData.isLikedByUser ? -1 : 1),
        };
      });
      return { prevState };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.prevState);
      toast({ variant: 'destructive', title: 'Sorry, there was an error. Please try again.' });
    },
  });

  return (
    <button
      className={cn(
        'flex items-center gap-1 font-medium text-muted-foreground',
        data.isLikedByUser && 'text-primary',
      )}
      onClick={() => mutation.mutate()}
      disabled={isPending || mutation.isPending}
    >
      <ThumbsUpIcon className={cn('size-5', data.isLikedByUser && 'fill-primary')} />
      {data.likesCount}
    </button>
  );
}
