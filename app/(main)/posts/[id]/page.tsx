import FollowButton from '@/app/components/follow-button';
import PostCard from '@/app/components/posts/post-card';
import UserAvatar from '@/app/components/user-avatar';
import { getPostById } from '@/app/lib/data';
import type { UserData } from '@/app/lib/types';
import { validateRequest } from '@/auth';
import type { User } from 'lucia';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params: { id } }: Props): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const post = await getPostById(id, loggedInUser.id);

  if (!post) notFound();

  return {
    title: `@${post.author.username}: ${post.content.replace(/(<([^>]+)>)/gi, '').slice(0, 50)}`,
  };
}

export default async function Page({ params: { id } }: Props) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return null;

  const post = await getPostById(id, loggedInUser.id);

  if (!post) notFound();

  return (
    <main className='grid items-start gap-8 lg:grid-cols-[1fr_auto]'>
      <PostCard post={post} />
      <aside className='sticky top-[calc(var(--navbar-height)_+_2rem)] hidden w-60 lg:block'>
        <AuthorInfo author={post.author} loggedInUser={loggedInUser} />
      </aside>
    </main>
  );
}

function AuthorInfo({ author, loggedInUser }: { author: UserData; loggedInUser: User }) {
  return (
    <article className='space-y-4 rounded-lg border bg-card p-4 shadow-md'>
      <h2 className='text-xl font-bold'>Post author</h2>
      <div className='grid grid-cols-[auto_1fr_auto] items-center gap-2'>
        <Link href={`/users/${author.id}`}>
          <UserAvatar src={author.avatarUrl} />
        </Link>
        <div>
          <h4 className='line-clamp-1 break-all'>
            <Link href={`/users/${author.id}`} className='hover:underline'>
              {author.displayName}
            </Link>
          </h4>
          <p className='line-clamp-1 break-all text-sm text-muted-foreground'>@{author.username}</p>
        </div>
        {author.id !== loggedInUser.id && (
          <FollowButton
            userId={author.id}
            initialData={{
              followedByCount: author._count.followedBy,
              isFollowedByUser: !!author.followedBy.length,
            }}
          />
        )}
      </div>
      {!!author.bio && <p className='line-clamp-6 break-words'>{author.bio}</p>}
    </article>
  );
}
