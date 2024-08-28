import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { Home, Bell, Mail, Bookmark } from 'lucide-react';

const links = [
  { name: 'Home', href: '/', icon: <Home className='h-4 w-4' /> },
  { name: 'Notifications', href: '/notifications', icon: <Bell className='h-4 w-4' /> },
  { name: 'Messages', href: '/messages', icon: <Mail className='h-4 w-4' /> },
  { name: 'Bookmarks', href: '/bookmarks', icon: <Bookmark className='h-4 w-4' /> },
];

export default function Menubar() {
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
      </nav>
    </aside>
  );
}
