import type { CommentData } from '@/app/lib/types';
import UserAvatar from '@/app/components/user-avatar';
import UserTooltip from '@/app/components/user-tooltip';
import Link from 'next/link';
import { formatDate } from '@/app/lib/utils';
import { useSession } from '@/app/(main)/session-provider';
import CommentCardMenu from './comment-card-menu';

export default function CommentCard({ comment }: { comment: CommentData }) {
  const { user: loggedInUser } = useSession();
  return (
    <article className='py-2 first:pt-0 last:pb-0'>
      <div className='grid grid-cols-[auto_1fr] items-start gap-2'>
        <UserTooltip user={comment.user}>
          <Link href={`/users/${comment.user.id}`}>
            <UserAvatar className='size-8' src={comment.user.avatarUrl} />
          </Link>
        </UserTooltip>
        <div>
          <header className='grid grid-cols-[1fr_auto] items-center gap-2'>
            <h4>
              <UserTooltip user={comment.user}>
                <Link href={`/users/${comment.user.id}`} className='font-medium hover:underline'>
                  {comment.user.displayName}
                </Link>
              </UserTooltip>{' '}
              <span className='text-sm text-muted-foreground'>{formatDate(comment.createdAt)}</span>
            </h4>
            {loggedInUser.id === comment.userId && <CommentCardMenu commentId={comment.id} />}
          </header>
          <p>{comment.content}</p>
        </div>
      </div>
    </article>
  );
}
