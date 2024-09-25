'use client';

import {
  useQueryClient,
  useMutation,
  type InfiniteData,
  type QueryFilters,
} from '@tanstack/react-query';
import { useToast } from '@/app/hooks/use-toast';
import { type PostsWithNextCursor } from '@/app/lib/types';
import { createPost, deletePost } from '@/app/(main)/actions';

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: async (newPost) => {
      const queryFilters = {
        queryKey: ['posts'],
        predicate: ({ queryKey }) =>
          queryKey.includes('by-user') ||
          (queryKey.includes('user-posts') && queryKey.includes(newPost.authorId)),
      } satisfies QueryFilters;
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
        predicate: (query) => queryFilters.predicate(query) && !query.state.data,
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

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      const queryFilters: QueryFilters = { queryKey: ['posts'] };
      await queryClient.cancelQueries(queryFilters);
      queryClient.setQueriesData<
        InfiniteData<PostsWithNextCursor, PostsWithNextCursor['nextCursor']>
      >(queryFilters, (oldData) => {
        if (!oldData) return;
        return {
          pages: oldData.pages.map(({ posts, nextCursor }) => ({
            posts: posts.filter((post) => post.id !== deletedPost.id),
            nextCursor,
          })),
          pageParams: oldData.pageParams,
        };
      });
      toast({ title: 'Your post was successfully deleted!' });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oops! Failed to delete a post!',
        description: error.message,
      });
    },
  });

  return mutation;
};
