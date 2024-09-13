import { Skeleton } from '@/app/components/ui/skeleton';

export default function PostCardSkeleton() {
  return (
    <div className='space-y-4 rounded-lg border bg-card p-4 shadow-md'>
      <div className='grid grid-cols-[auto_1fr] items-center gap-2'>
        <Skeleton className='h-10 w-10 rounded-full' />
        <div className='space-y-2'>
          <Skeleton className='h-4' />
          <Skeleton className='h-4' />
        </div>
      </div>
      <Skeleton className='h-10' />
    </div>
  );
}
