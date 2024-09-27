'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import type { UserData } from '@/app/lib/types';
import Link from 'next/link';
import UserTooltip from './user-tooltip';
import { HTTPError } from 'ky';

export default function UserMention({
  children,
  username,
}: {
  children: React.ReactNode;
  username: string;
}) {
  const { data } = useQuery({
    queryKey: ['user-data', username],
    queryFn: () => api(`/api/users/username/${username}`).json<UserData>(),
    retry: (failureCount, error) => {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: Infinity,
  });

  if (!data) {
    return (
      <Link href={`/users/${username}`} className='text-primary hover:underline'>
        {children}
      </Link>
    );
  }

  return (
    <UserTooltip user={data}>
      <Link href={`/users/${data.id}`} className='text-primary hover:underline'>
        {children}
      </Link>
    </UserTooltip>
  );
}
