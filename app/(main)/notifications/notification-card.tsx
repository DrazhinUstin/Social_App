import type { NotificationData } from '@/app/lib/types';
import type { NotificationType } from '@prisma/client';
import { MessageCircle, ThumbsUp, Trash2Icon, UserRoundCheck } from 'lucide-react';
import UserAvatar from '@/app/components/user-avatar';
import Link from 'next/link';
import UserTooltip from '@/app/components/user-tooltip';
import { cn, formatDate } from '@/app/lib/utils';
import { useDeleteNotificationMutation } from './mutations';

const cardData: Record<NotificationType, { icon: JSX.Element; message: string }> = {
  LIKE: { icon: <ThumbsUp />, message: 'liked your' },
  COMMENT: { icon: <MessageCircle />, message: 'commented on your' },
  FOLLOW: { icon: <UserRoundCheck />, message: 'follow you!' },
};

export default function NotificationCard({ notification }: { notification: NotificationData }) {
  const mutation = useDeleteNotificationMutation();
  return (
    <article
      className={cn(
        'rounded-lg border bg-card p-4 shadow-md transition-colors sm:grid sm:grid-cols-[auto_1fr] sm:items-center sm:gap-4',
        !notification.read && 'bg-primary/5',
      )}
    >
      <span className='hidden size-12 place-items-center rounded-full bg-primary text-primary-foreground sm:grid'>
        {cardData[notification.type].icon}
      </span>
      <div className='grid grid-cols-[auto_1fr_5rem_auto] items-center gap-2'>
        <UserTooltip user={notification.issuer}>
          <Link href={`/users/${notification.issuer.id}`}>
            <UserAvatar src={notification.issuer.avatarUrl} />
          </Link>
        </UserTooltip>
        <p>
          <UserTooltip user={notification.issuer}>
            <Link href={`/users/${notification.issuer.id}`} className='font-medium hover:underline'>
              {notification.issuer.displayName}
            </Link>
          </UserTooltip>{' '}
          {cardData[notification.type].message}
          {notification.post && (
            <>
              {' '}
              <Link
                href={`posts/${notification.postId}`}
                className='font-medium text-primary hover:underline'
              >
                post
              </Link>
              !
            </>
          )}
        </p>
        <p className='text-center text-sm text-muted-foreground'>
          {formatDate(notification.createdAt)}
        </p>
        <button
          className='text-destructive'
          title='Delete notification'
          onClick={() => mutation.mutate(notification.id)}
          disabled={mutation.isPending}
        >
          <Trash2Icon className='size-5' />
        </button>
      </div>
    </article>
  );
}
