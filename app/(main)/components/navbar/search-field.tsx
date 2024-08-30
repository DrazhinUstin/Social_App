'use client';

import { useRouter } from 'next/navigation';
import { Input } from '@/app/components/ui/input';
import { Search } from 'lucide-react';

export default function SearchField() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = (new FormData(e.currentTarget).get('query') as string).trim();
    if (!value) return;
    router.push(`/search?query=${encodeURIComponent(value)}`);
  };

  return (
    <form action='/search' onSubmit={handleSubmit} className='relative'>
      <Input name='query' placeholder='Search...' className='w-40 pr-8' />
      <Search className='absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground' />
    </form>
  );
}
