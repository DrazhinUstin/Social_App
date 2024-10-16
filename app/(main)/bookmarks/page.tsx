import Feed from '@/app/components/posts/feed';
import type { Metadata } from 'next';
import Sidebar from '@/app/(main)/components/sidebar';

export const metadata: Metadata = {
  title: 'Bookmarks',
};

export default function Page() {
  return (
    <main className='grid grid-cols-[1fr_auto] items-start gap-8'>
      <Feed queryKey={['post-feed', 'bookmarked']} url='/api/posts/bookmarked' />
      <Sidebar />
    </main>
  );
}
