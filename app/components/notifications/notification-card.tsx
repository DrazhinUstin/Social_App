import type { NotificationData } from '@/app/lib/types';
import type { NotificationType } from '@prisma/client';
import { MessageCircle, ThumbsUp, UserRoundCheck } from 'lucide-react';
import UserAvatar from '@/app/components/user-avatar';
import Link from 'next/link';
import UserTooltip from '@/app/components/user-tooltip';
import { formatDate } from '@/app/lib/utils';

const cardData: Record<NotificationType, { icon: JSX.Element; message: string }> = {
  LIKE: { icon: <ThumbsUp />, message: 'liked your' },
  COMMENT: { icon: <MessageCircle />, message: 'commented on your' },
  FOLLOW: { icon: <UserRoundCheck />, message: 'follow you!' },
};

export default function NotificationCard({ notification }: { notification: NotificationData }) {
  return (
    <article className='grid grid-cols-[auto_1fr] items-center gap-4 rounded-lg border bg-card p-4 shadow-md'>
      <span className='grid size-12 place-items-center rounded-full bg-primary text-primary-foreground'>
        {cardData[notification.type].icon}
      </span>
      <div className='grid grid-cols-[auto_1fr_auto] items-center gap-2'>
        <UserTooltip user={notification.issuer}>
          <Link href={`/users/${notification.issuer.id}`}>
            <UserAvatar src={notification.issuer.avatarUrl} />
          </Link>
        </UserTooltip>
        <h4>
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
        </h4>
        <p className='text-right text-sm text-muted-foreground'>
          {formatDate(notification.createdAt)}
        </p>
      </div>
    </article>
  );
}
