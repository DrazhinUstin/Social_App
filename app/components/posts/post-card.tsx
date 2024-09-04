import type { PostData } from '@/app/lib/types';
import Link from 'next/link';
import UserAvatar from '@/app/components/user-avatar';
import { formatDate } from '@/app/lib/utils';

export default function PostCard({ id, content, createdAt, author }: PostData) {
  return (
    <article className='space-y-4 rounded-lg border bg-card p-4 shadow-md'>
      <header className='grid grid-cols-[auto_1fr] items-center gap-2'>
        <Link href={`/users/${author.username}`}>
          <UserAvatar src={author.avatarUrl} />
        </Link>
        <div>
          <h4 className='font-medium hover:underline'>
            <Link href={`/users/${author.username}`}>{author.displayName}</Link>
          </h4>
          <p className='text-sm text-muted-foreground'>{formatDate(createdAt)}</p>
        </div>
      </header>
      <div className='space-y-2' dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
