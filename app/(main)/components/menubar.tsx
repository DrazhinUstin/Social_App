import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { Home, Bookmark } from 'lucide-react';
import MessagesCounter from './messages-counter';
import NotificationsCounter from './notifications-counter';
import { validateRequest } from '@/auth';
import { getUnreadMessagesCount, getUnreadNotificationsCount } from '@/app/lib/data';

const links = [
  { name: 'Home', href: '/', icon: <Home className='h-4 w-4' /> },
  { name: 'Bookmarks', href: '/bookmarks', icon: <Bookmark className='h-4 w-4' /> },
];

export default async function Menubar() {
  const { user } = await validateRequest();
  const [unreadMessagesCount, unreadNotificationsCount] = await Promise.all([
    getUnreadMessagesCount(user?.id as string),
    getUnreadNotificationsCount(user?.id as string),
  ]);
  return (
    <aside className='sticky bottom-8 z-50 rounded-lg border bg-card p-2 shadow-md sm:top-[calc(var(--navbar-height)+2rem)]'>
      <nav className='flex justify-around sm:flex-col'>
        {links.map(({ name, href, icon }) => (
          <Button key={name} variant='ghost' asChild>
            <Link href={href} title={name}>
              {icon}
              <span className='ml-2 hidden md:inline'>{name}</span>
            </Link>
          </Button>
        ))}
        <MessagesCounter initialUnreadCount={unreadMessagesCount} />
        <NotificationsCounter initialUnreadCount={unreadNotificationsCount} />
      </nav>
    </aside>
  );
}
