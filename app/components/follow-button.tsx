'use client';

import { useQueryClient, useQuery, useMutation, type QueryKey } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import type { FollowInfo } from '@/app/lib/types';
import { Button } from '@/app/components/ui/button';
import { useToast } from '@/app/hooks/use-toast';

export default function FollowButton({
  userId,
  initialData,
}: {
  userId: string;
  initialData: FollowInfo;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ['users', userId, 'follow-info'];

  const { isPending, data } = useQuery({
    queryKey,
    queryFn: () => api(`/api/users/${userId}/follows`).json<FollowInfo>(),
    staleTime: Infinity,
    initialData,
  });

  const mutation = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? api.delete(`/api/users/${userId}/follows`)
        : api.post(`/api/users/${userId}/follows`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const prevState = queryClient.getQueryData<FollowInfo>(queryKey);
      queryClient.setQueryData<FollowInfo>(queryKey, (oldData) => {
        if (!oldData) return;
        return {
          isFollowedByUser: !oldData.isFollowedByUser,
          followedByCount: oldData.isFollowedByUser
            ? oldData.followedByCount - 1
            : oldData.followedByCount + 1,
        };
      });
      return { prevState };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context?.prevState);
      toast({
        variant: 'destructive',
        description: 'Sorry, there was an error. Please try again.',
      });
    },
  });

  return (
    <Button
      size='sm'
      variant={data.isFollowedByUser ? 'outline' : 'default'}
      disabled={isPending || mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      {data.isFollowedByUser ? 'Unfollow' : 'Follow'}
    </Button>
  );
}
