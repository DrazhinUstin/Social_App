'use client';

import { useToast } from '@/app/hooks/use-toast';
import {
  type InfiniteData,
  type QueryKey,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { createComment, deleteComment } from './actions';
import type { CommentsWithNextCursor } from '@/app/lib/types';

export const useCreateCommentMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: async (newComment) => {
      const queryKey: QueryKey = ['comments', newComment.postId];
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<
        InfiniteData<CommentsWithNextCursor, CommentsWithNextCursor['nextCursor']>
      >(queryKey, (oldData) => {
        if (!oldData) return oldData;
        return {
          pageParams: oldData.pageParams,
          pages: [
            {
              nextCursor: oldData.pages[0].nextCursor,
              comments: [...oldData.pages[0].comments, newComment],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
      queryClient.invalidateQueries({ queryKey, predicate: (query) => !query.state.data });
      toast({ title: 'Comment was created!' });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oops! Failed to create a comment!',
        description: error.message,
      });
    },
  });

  return mutation;
};

export const useDeleteCommentMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {
      const queryKey: QueryKey = ['comments', deletedComment.postId];
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData<
        InfiniteData<CommentsWithNextCursor, CommentsWithNextCursor['nextCursor']>
      >(queryKey, (oldData) => {
        if (!oldData) return oldData;
        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            nextCursor: page.nextCursor,
            comments: page.comments.filter((comment) => comment.id !== deletedComment.id),
          })),
        };
      });
      toast({ title: 'Comment was deleted!' });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oops! Failed to delete a comment!',
        description: error.message,
      });
    },
  });

  return mutation;
};
