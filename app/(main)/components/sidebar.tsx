import { Suspense } from 'react';
import Link from 'next/link';
import { validateRequest } from '@/auth';
import { prisma } from '@/client';
import UserAvatar from '@/app/components/user-avatar';
import { Button } from '@/app/components/ui/button';
import { Loader2 } from 'lucide-react';

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
    where: { id: { not: user.id } },
    take: 5,
    select: { id: true, username: true, displayName: true, avatarUrl: true },
  });
  return (
    <div className='space-y-2 rounded-lg border bg-card p-2 shadow-md'>
      <h2 className='text-center text-xl font-semibold'>Who to follow</h2>
      {users.map(({ id, username, displayName, avatarUrl }) => (
        <article key={id} className='grid grid-cols-[auto_1fr_auto] items-center gap-2'>
          <Link href={`users/${username}`}>
            <UserAvatar src={avatarUrl} />
          </Link>
          <div>
            <h4 className='line-clamp-1 break-all font-medium hover:underline'>
              <Link href={`users/${username}`}>{displayName}</Link>
            </h4>
            <p className='line-clamp-1 break-all text-sm text-muted-foreground'>@{username}</p>
          </div>
          <Button size='sm'>Follow</Button>
        </article>
      ))}
    </div>
  );
}