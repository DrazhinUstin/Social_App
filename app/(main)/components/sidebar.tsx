import { Suspense } from 'react';
import Link from 'next/link';
import { validateRequest } from '@/auth';
import { prisma } from '@/client';
import UserAvatar from '@/app/components/user-avatar';
import FollowButton from '@/app/components/follow-button';
import { Loader2 } from 'lucide-react';
import { getUserSelect } from '@/app/lib/types';

export default function Sidebar() {
  return (
    <aside className='sticky top-[calc(var(--navbar-height)+2rem)] hidden w-60 lg:block'>
      <Suspense fallback={<Loader2 className='mx-auto animate-spin' />}>
        <WhoToFollow />
      </Suspense>
    </aside>
  );
}

async function WhoToFollow() {
  const { user } = await validateRequest();
  if (!user) return null;
  const users = await prisma.user.findMany({
    where: { id: { not: user.id }, followedBy: { none: { followedById: user.id } } },
    take: 5,
    select: getUserSelect(user.id),
  });
  return (
    <div className='space-y-2 rounded-lg border bg-card p-2 shadow-md'>
      <h2 className='text-center text-xl font-semibold'>Who to follow</h2>
      {users.map(({ id, username, displayName, avatarUrl, followedBy, _count }) => (
        <article key={id} className='grid grid-cols-[auto_1fr_auto] items-center gap-2'>
          <Link href={`/users/${id}`}>
            <UserAvatar src={avatarUrl} />
          </Link>
          <div>
            <h4 className='line-clamp-1 break-all font-medium hover:underline'>
              <Link href={`/users/${id}`}>{displayName}</Link>
            </h4>
            <p className='line-clamp-1 break-all text-sm text-muted-foreground'>@{username}</p>
          </div>
          <FollowButton
            userId={id}
            initialData={{ isFollowedByUser: !!followedBy[0], followedByCount: _count.followedBy }}
          />
        </article>
      ))}
    </div>
  );
}
