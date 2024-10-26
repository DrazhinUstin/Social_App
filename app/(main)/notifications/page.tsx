import type { Metadata } from 'next';
import Sidebar from '@/app/(main)/components/sidebar';
import Notifications from './notifications';

export const metadata: Metadata = {
  title: 'Notifications',
};

export default function Page() {
  return (
    <main className='grid grid-cols-[1fr_auto] items-start gap-8'>
      <div className='space-y-8'>
        <h2 className='rounded-lg border bg-card p-4 text-center text-2xl font-semibold shadow-md'>
          Notifications
        </h2>
        <Notifications />
      </div>
      <Sidebar />
    </main>
  );
}
