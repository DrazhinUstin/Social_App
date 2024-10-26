'use client';

import { useQueryClient, useMutation, type InfiniteData } from '@tanstack/react-query';
import { useToast } from '@/app/hooks/use-toast';
import { api } from '@/app/lib/api';
import type { NotificationData, NotificationsWithNextCursor } from '@/app/lib/types';

export const useMarkNotificationsAsReadMutation = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => api.patch('/api/notifications/mark-as-read'),
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey: ['unread-notifications-count'] });
      queryClient.setQueryData(['unread-notifications-count'], 0);
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        description: 'Sorry, an error occurred while marking notifications as read...',
      });
    },
  });

  return mutation;
};

export const useDeleteNotificationMutation = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/notifications/${id}`).json<NotificationData>(),
    onMutate: async (deletedNotificationId: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      const prevState = queryClient.getQueryData<
        InfiniteData<NotificationsWithNextCursor, NotificationsWithNextCursor['nextCursor']>
      >(['notifications']);

      queryClient.setQueryData<
        InfiniteData<NotificationsWithNextCursor, NotificationsWithNextCursor['nextCursor']>
      >(['notifications'], (oldData) => {
        if (!oldData) return oldData;
        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map(({ notifications, nextCursor }) => ({
            notifications: notifications.filter(({ id }) => id !== deletedNotificationId),
            nextCursor,
          })),
        };
      });

      return { prevState };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['notifications'], context?.prevState);
      toast({
        variant: 'destructive',
        description: 'Failed to delete a notification. Please try again.',
      });
    },
  });

  return mutation;
};
