'use client';

import type { PostData } from '@/app/lib/types';
import { useSession } from '@/app/(main)/session-provider';
import { useState } from 'react';
import Link from 'next/link';
import UserAvatar from '@/app/components/user-avatar';
import { formatDate } from '@/app/lib/utils';
import PostCardMenu from './post-card-menu';
import UserTooltip from '@/app/components/user-tooltip';
import Linkify from '@/app/components/linkify';
import Image from 'next/image';
import LikeButton from './like-button';
import BookmarkButton from './bookmark-button';
import { MessageCircleIcon } from 'lucide-react';
import Comments from '@/app/components/comments';

export default function PostCard({
  id,
  content,
  createdAt,
  author,
  attachments,
  likes,
  bookmarks,
  _count,
}: PostData) {
  const { user } = useSession();
  const [openComments, setOpenComments] = useState<boolean>(false);
  return (
    <article className='space-y-4 rounded-lg border bg-card p-4 shadow-md'>
      <header className='grid grid-cols-[1fr_auto] items-center gap-2'>
        <div className='grid grid-cols-[auto_1fr] items-center gap-2'>
          <UserTooltip user={author}>
            <Link href={`/users/${author.id}`}>
              <UserAvatar src={author.avatarUrl} />
            </Link>
          </UserTooltip>
          <div>
            <h4>
              <UserTooltip user={author}>
                <Link className='font-medium hover:underline' href={`/users/${author.id}`}>
                  {author.displayName}
                </Link>
              </UserTooltip>
            </h4>
            <p className='text-sm text-muted-foreground'>
              <Link className='hover:underline' href={`/posts/${id}`}>
                {formatDate(createdAt)}
              </Link>
            </p>
          </div>
        </div>
        {author.id === user.id && <PostCardMenu postId={id} />}
      </header>
      <Linkify>
        <div className='space-y-2' dangerouslySetInnerHTML={{ __html: content }} />
      </Linkify>
      <div className='flex flex-wrap items-center justify-center gap-3'>
        {attachments.map(({ id, mediaType, url }) => {
          return (
            <div key={id}>
              {mediaType === 'Image' ? (
                <Image
                  src={url}
                  alt='post image'
                  width={500}
                  height={500}
                  className='block w-full max-w-80'
                />
              ) : (
                <video src={url} className='block w-full max-w-80' controls />
              )}
            </div>
          );
        })}
      </div>
      <hr />
      <footer className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <LikeButton
            postId={id}
            initialData={{ isLikedByUser: !!likes.length, likesCount: _count.likes }}
          />
          <button
            className='flex items-center gap-1 font-medium text-muted-foreground'
            onClick={() => setOpenComments(!openComments)}
          >
            <MessageCircleIcon className='size-5' />
            {_count.comments}
          </button>
        </div>
        <BookmarkButton postId={id} initialData={{ isBookmarkedByUser: !!bookmarks.length }} />
      </footer>
      {openComments && <Comments postId={id} />}
    </article>
  );
}
