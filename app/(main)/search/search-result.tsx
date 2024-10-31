'use client';

import InfiniteScrollWrapper from '@/app/components/infinite-scroll-wrapper';
import PostCard from '@/app/components/posts/post-card';
import PostCardSkeleton from '@/app/components/posts/post-card-skeleton';
import { api } from '@/app/lib/api';
import type { PostsWithNextCursor } from '@/app/lib/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

export default function SearchResult({ query }: { query: string }) {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['posts', 'search', query],
      queryFn: ({ pageParam }) =>
        api('api/search', {
          searchParams: { query, ...(pageParam ? { cursor: pageParam } : {}) },
        }).json<PostsWithNextCursor>(),
      initialPageParam: null as PostsWithNextCursor['nextCursor'],
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  if (status === 'pending') {
    return <PostCardSkeleton />;
  }

  if (status === 'error') {
    return (
      <p className='text-center text-destructive'>
        Sorry, an error occurred while loading posts. Please try again.
      </p>
    );
  }

  const posts = data.pages.map((page) => page.posts).flat();

  if (!posts.length) {
    return (
      <p className='text-center text-muted-foreground'>
        Sorry, no posts were found for your search...
      </p>
    );
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
