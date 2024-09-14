'use client';

import {
  useQueryClient,
  useMutation,
  type InfiniteData,
  type QueryFilters,
} from '@tanstack/react-query';
import { useToast } from '@/app/hooks/use-toast';
import { type PostsWithNextCursor } from '@/app/lib/types';
import { createPost } from '@/app/(main)/actions';

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: async (newPost) => {
      const queryFilters: QueryFilters = { queryKey: ['posts', 'by-user'] };
      await queryClient.cancelQueries(queryFilters);
      queryClient.setQueriesData<
        InfiniteData<PostsWithNextCursor, PostsWithNextCursor['nextCursor']>
      >(queryFilters, (oldData) => {
        const firstPage = oldData?.pages[0];
        if (firstPage) {
          return {
            pages: [
              { posts: [newPost, ...firstPage.posts], nextCursor: firstPage.nextCursor },
              ...oldData.pages.slice(1),
            ],
            pageParams: oldData.pageParams,
          };
        }
      });
      queryClient.invalidateQueries({
        queryKey: queryFilters.queryKey,
        predicate: (query) => !query.state.data,
      });
      toast({
        title: 'Your post was successfully created!',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oops! Failed to create a post!',
        description: error.message,
      });
    },
  });

  return mutation;
};
