import CreatePostForm from '@/app/components/posts/create-post-form';
import Feed from '@/app/components/posts/feed';
import Sidebar from './components/sidebar';

export default async function Page() {
  return (
    <main className='grid items-start gap-8 lg:grid-cols-[1fr_auto]'>
      <div className='space-y-8'>
        <CreatePostForm />
        <Feed />
      </div>
      <Sidebar />
    </main>
  );
}
