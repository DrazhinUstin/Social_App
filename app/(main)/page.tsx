import CreatePostForm from '@/app/components/posts/create-post-form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import Feed from '@/app/components/posts/feed';
import Sidebar from './components/sidebar';

export default async function Page() {
  return (
    <main className='grid items-start gap-8 lg:grid-cols-[1fr_auto]'>
      <div className='space-y-8'>
        <CreatePostForm />
        <Tabs defaultValue='by-user'>
          <TabsList>
            <TabsTrigger value='by-user'>Created</TabsTrigger>
            <TabsTrigger value='following'>Following</TabsTrigger>
          </TabsList>
          <TabsContent value='by-user'>
            <Feed queryKey={['posts', 'by-user']} url='/api/posts/by-user' />
          </TabsContent>
          <TabsContent value='following'>
            <Feed queryKey={['posts', 'following']} url='/api/posts/following' />
          </TabsContent>
        </Tabs>
      </div>
      <Sidebar />
    </main>
  );
}
