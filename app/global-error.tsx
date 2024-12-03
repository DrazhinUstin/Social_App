'use client';

import { Button } from '@/app/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <main className='mx-auto grid min-h-screen w-[90vw] max-w-7xl place-items-center'>
          <div className='space-y-4 text-center'>
            <h2 className='text-2xl font-semibold'>Sorry, there was an error!</h2>
            <p className='break-words text-muted-foreground'>{error.message}</p>
            <Button onClick={() => reset()}>Try again</Button>
          </div>
        </main>
      </body>
    </html>
  );
}
