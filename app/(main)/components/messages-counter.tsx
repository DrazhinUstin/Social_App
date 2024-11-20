'use client';

import { Button } from '@/app/components/ui/button';
import { api } from '@/app/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Mail } from 'lucide-react';
import Link from 'next/link';

export default function MessagesCounter({ initialUnreadCount }: { initialUnreadCount: number }) {
  const { data } = useQuery({
    queryKey: ['unread-messages-count'],
    queryFn: () => api('/api/stream/unread-count').json<number>(),
    initialData: initialUnreadCount,
    refetchInterval: 60 * 1000,
  });
  return (
    <Button variant='ghost' asChild>
      <Link href='/messages' title='Messages' className='relative'>
        <Mail className='h-4 w-4' />
        <span className='ml-2 hidden md:inline'>Messages</span>
        {data > 0 && (
          <span className='absolute -right-1 -top-[1px] grid size-5 place-items-center rounded-full bg-primary text-xs tabular-nums text-primary-foreground'>
            {data}
          </span>
        )}
      </Link>
    </Button>
  );
}
