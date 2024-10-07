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
import { z } from 'zod';
import { EditProfileSchema } from '@/app/lib/schemas';
import { useUploadThing } from '@/app/lib/uploadthing';

export const useEditProfileMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  const { startUpload } = useUploadThing('userAvatar');

  const mutation = useMutation({
    mutationFn: ({ values, file }: { values: z.infer<typeof EditProfileSchema>; file?: File }) =>
      Promise.all([editProfile(values), file && startUpload([file])]),
    onSuccess: async ([updatedUser, uploadResult]) => {
      const queryFilters: QueryFilters = { queryKey: ['posts'] };
      await queryClient.cancelQueries(queryFilters);
      queryClient.setQueriesData<
        InfiniteData<PostsWithNextCursor, PostsWithNextCursor['nextCursor']>
      >(queryFilters, (oldData) => {
        if (!oldData) return oldData;
        let newAvatarUrl: string | undefined;
        if (uploadResult) {
          newAvatarUrl = uploadResult[0].url.replace(
            '/f/',
            `/a/${process.env.NEXT_PUBLIC_APP_ID}/`,
          );
        }
        return {
          pages: oldData.pages.map(({ posts, nextCursor }) => ({
            posts: posts.map((post) => {
              if (post.authorId === updatedUser.id) {
                return {
                  ...post,
                  author: { ...updatedUser, avatarUrl: newAvatarUrl || updatedUser.avatarUrl },
                };
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
