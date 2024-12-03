'use client';

import { Button } from '@/app/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className='space-y-4 text-center'>
      <h2 className='text-2xl font-semibold'>Sorry, there was an error!</h2>
      <p className='break-words text-muted-foreground'>{error.message}</p>
      <Button onClick={() => reset()}>Try again</Button>
    </main>
  );
}
