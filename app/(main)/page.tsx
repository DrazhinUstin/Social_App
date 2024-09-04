import CreatePostForm from '@/app/components/posts/create-post-form';
import Sidebar from './components/sidebar';

export default async function Page() {
  return (
    <main className='grid items-start gap-8 lg:grid-cols-[1fr_auto]'>
      <div>
        <CreatePostForm />
      </div>
      <Sidebar />
    </main>
  );
}
