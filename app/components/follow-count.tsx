'use client';

import type { FollowInfo } from '@/app/lib/types';
import { useFollowInfo } from '@/app/hooks/use-follow-info';
import clsx from 'clsx';

export default function FollowCount({
  userId,
  initialData,
  className,
}: {
  userId: string;
  initialData: FollowInfo;
  className?: string;
}) {
  const { data } = useFollowInfo(userId, initialData);
  return <span className={clsx('font-medium', className)}>{data.followedByCount}</span>;
}
