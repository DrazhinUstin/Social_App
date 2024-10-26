'use client';

import { api } from '@/app/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { Bell } from 'lucide-react';

export default function NotificationsCounter({
  initialUnreadCount,
}: {
  initialUnreadCount: number;
}) {
  const { data } = useQuery({
    queryKey: ['unread-notifications-count'],
    queryFn: () => api(`/api/notifications/unread-count`).json<number>(),
    initialData: initialUnreadCount,
    refetchInterval: 60 * 1000,
  });
  return (
    <Button variant='ghost' asChild>
      <Link href='/notifications' title='Notifications' className='relative'>
        <Bell className='h-4 w-4' />
        <span className='ml-2 hidden md:inline'>Notifications</span>
        {data > 0 && (
          <span className='absolute -right-1 -top-[1px] grid size-5 place-items-center rounded-full bg-primary text-xs tabular-nums text-primary-foreground'>
            {data}
          </span>
        )}
      </Link>
    </Button>
  );
}
