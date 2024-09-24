'use client';

import type { PostData } from '@/app/lib/types';
import { useSession } from '@/app/(main)/session-provider';
import Link from 'next/link';
import UserAvatar from '@/app/components/user-avatar';
import { formatDate } from '@/app/lib/utils';
import PostCardMenu from './post-card-menu';

export default function PostCard({ id, content, createdAt, author }: PostData) {
  const { user } = useSession();
  return (
    <article className='space-y-4 rounded-lg border bg-card p-4 shadow-md'>
      <header className='grid grid-cols-[1fr_auto] items-center gap-2'>
        <div className='grid grid-cols-[auto_1fr] items-center gap-2'>
          <Link href={`/users/${author.id}`}>
            <UserAvatar src={author.avatarUrl} />
          </Link>
          <div>
            <h4>
              <Link className='font-medium hover:underline' href={`/users/${author.id}`}>
                {author.displayName}
              </Link>
            </h4>
            <p className='text-sm text-muted-foreground'>{formatDate(createdAt)}</p>
          </div>
        </div>
        {author.id === user.id && <PostCardMenu postId={id} />}
      </header>
      <div className='space-y-2' dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
