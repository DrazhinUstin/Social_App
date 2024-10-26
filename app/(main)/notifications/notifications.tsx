'use client';

import { api } from '@/app/lib/api';
import type { NotificationsWithNextCursor } from '@/app/lib/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMarkNotificationsAsReadMutation } from './mutations';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import InfiniteScrollWrapper from '@/app/components/infinite-scroll-wrapper';
import PostCardSkeleton from '@/app/components/posts/post-card-skeleton';
import NotificationCard from './notification-card';

export default function Notifications() {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['notifications'],
      queryFn: ({ pageParam }) =>
        api(
          '/api/notifications',
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        ).json<NotificationsWithNextCursor>(),
      initialPageParam: null as NotificationsWithNextCursor['nextCursor'],
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const { mutate } = useMarkNotificationsAsReadMutation();

  useEffect(() => {
    mutate();
  }, []);

  if (status === 'pending') {
    return <PostCardSkeleton />;
  }

  if (status === 'error') {
    return (
      <p className='text-center text-destructive'>
        Sorry, there was an error while loading notifications: {error.message}
      </p>
    );
  }

  const notifications = data.pages.map((page) => page.notifications).flat();

  if (!notifications.length) {
    return <p className='text-center text-muted-foreground'>You have no notifications yet...</p>;
  }

  return (
    <InfiniteScrollWrapper onEndReached={() => !isFetching && hasNextPage && fetchNextPage()}>
      <div className='space-y-8'>
        {notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
        {isFetchingNextPage && <Loader2 className='mx-auto animate-spin' />}
      </div>
    </InfiniteScrollWrapper>
  );
}
