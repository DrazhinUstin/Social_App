'use client';

import {
  useQueryClient,
  useMutation,
  type QueryFilters,
  type InfiniteData,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/hooks/use-toast';
import { editProfile } from './actions';
import type { PostsWithNextCursor } from '@/app/lib/types';

export const useEditProfileMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: editProfile,
    onSuccess: async (updatedUser) => {
      const queryFilters: QueryFilters = { queryKey: ['posts'] };
      await queryClient.cancelQueries(queryFilters);
      queryClient.setQueriesData<
        InfiniteData<PostsWithNextCursor, PostsWithNextCursor['nextCursor']>
      >(queryFilters, (oldData) => {
        if (!oldData) return oldData;
        return {
          pages: oldData.pages.map(({ posts, nextCursor }) => ({
            posts: posts.map((post) => {
              if (post.authorId === updatedUser.id) {
                return { ...post, author: updatedUser };
              }
              return post;
            }),
            nextCursor,
          })),
          pageParams: oldData.pageParams,
        };
      });
      toast({ title: 'Profile was successfully edited!' });
      router.refresh();
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Failed to edit a profile. Please try again.',
      });
    },
  });

  return mutation;
};
