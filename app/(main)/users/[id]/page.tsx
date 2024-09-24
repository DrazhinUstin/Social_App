import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { validateRequest } from '@/auth';
import { getUserById } from '@/app/lib/data';
import type { FollowInfo } from '@/app/lib/types';
import { formatDate } from '@/app/lib/utils';
import UserAvatar from '@/app/components/user-avatar';
import FollowCount from '@/app/components/follow-count';
import { Button } from '@/app/components/ui/button';
import FollowButton from '@/app/components/follow-button';
import Feed from '@/app/components/posts/feed';
import Sidebar from '@/app/(main)/components/sidebar';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params: { id } }: Props): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return {};
  const user = await getUserById(id, loggedInUser.id);
  if (!user) notFound();
  return { title: user.username };
}

export default async function Page({ params: { id } }: Props) {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return null;
  const user = await getUserById(id, loggedInUser.id);
  if (!user) notFound();
  const followInfo: FollowInfo = {
    isFollowedByUser: !!user.followedBy[0],
    followedByCount: user._count.followedBy,
  };
  return (
    <main>
      <div className='grid grid-cols-[1fr_auto] items-start gap-8'>
        <div className='space-y-8'>
          <div className='space-y-2 rounded-lg border bg-card p-4 text-center shadow-md'>
            <UserAvatar src={user.avatarUrl} width={150} height={150} className='m-auto' />
            <div>
              <h2 className='text-2xl font-bold'>{user.displayName}</h2>
              <p className='text-muted-foreground'>@{user.username}</p>
            </div>
            <p>Member since {formatDate(user.createdAt)}</p>
            <ul className='flex flex-wrap justify-center gap-4'>
              <li>
                Posts: <span className='font-medium'>{user._count.posts}</span>
              </li>
              <li>
                Followers: <FollowCount userId={user.id} initialData={followInfo} />
              </li>
            </ul>
            {user.id === loggedInUser.id ? (
              <Button>Edit profile</Button>
            ) : (
              <FollowButton userId={user.id} initialData={followInfo} />
            )}
          </div>
          <Feed queryKey={['posts', 'user-posts', user.id]} url={`/api/users/${user.id}/posts`} />
        </div>
        <Sidebar />
      </div>
    </main>
  );
}
