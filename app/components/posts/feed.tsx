'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import type { PostsWithNextCursor } from '@/app/lib/types';
import PostCardSkeleton from '@/app/components/posts/post-card-skeleton';
import InfiniteScrollWrapper from '@/app/components/infinite-scroll-wrapper';
import PostCard from '@/app/components/posts/post-card';
import { Loader2 } from 'lucide-react';

export default function Feed() {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['posts', 'by-user'],
      queryFn: async ({ pageParam }) =>
        await api('/api/posts/by-user', {
          searchParams: pageParam ? { cursor: pageParam } : undefined,
        }).json<PostsWithNextCursor>(),
      initialPageParam: null as PostsWithNextCursor['nextCursor'],
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  if (status === 'pending') {
    return <PostCardSkeleton />;
  }

  if (status === 'error') {
    return <p className='text-center text-muted-foreground'>{error.message}</p>;
  }

  const posts = data.pages.map((page) => page.posts).flat();

  if (!posts.length) {
    return <p className='text-center text-muted-foreground'>No posts to display...</p>;
  }

  return (
    <InfiniteScrollWrapper onEndReached={() => !isFetching && hasNextPage && fetchNextPage()}>
      <div className='space-y-8'>
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
        {isFetchingNextPage && <Loader2 className='mx-auto animate-spin' />}
      </div>
    </InfiniteScrollWrapper>
  );
}
