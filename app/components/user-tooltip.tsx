'use client';

import type { UserData, FollowInfo } from '@/app/lib/types';
import { useSession } from '@/app/(main)/session-provider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';
import Link from 'next/link';
import UserAvatar from './user-avatar';
import FollowCount from './follow-count';
import FollowButton from './follow-button';

export default function UserTooltip({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserData;
}) {
  const { user: loggedInUser } = useSession();
  const followInfo: FollowInfo = {
    isFollowedByUser: !!user.followedBy[0],
    followedByCount: user._count.followedBy,
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>
          <div className='space-y-2'>
            <div className='grid grid-cols-[auto_1fr] items-center gap-2'>
              <Link href={`/users/${user.id}`}>
                <UserAvatar src={user.avatarUrl} width={40} height={40} />
              </Link>
              <div>
                <h4>
                  <Link className='font-medium hover:underline' href={`/users/${user.id}`}>
                    {user.displayName}
                  </Link>
                </h4>
                <p className='text-muted-foreground'>@{user.username}</p>
              </div>
            </div>
            <ul className='flex flex-wrap gap-3'>
              <li>
                Followers: <FollowCount userId={user.id} initialData={followInfo} />
              </li>
              <li>
                Posts: <span className='font-medium'>{user._count.posts}</span>
              </li>
            </ul>
            {user.id !== loggedInUser.id && (
              <div className='text-center'>
                <FollowButton userId={user.id} initialData={followInfo} />
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
