'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/app/lib/api';
import type { FollowInfo } from '@/app/lib/types';

export const useFollowInfo = (userId: string, initialData: FollowInfo) => {
  const query = useQuery({
    queryKey: ['follow-info', userId],
    queryFn: () => api(`/api/users/${userId}/follows`).json<FollowInfo>(),
    staleTime: Infinity,
    initialData,
  });
  return query;
};
