import Sidebar from '@/app/(main)/components/sidebar';
import type { Metadata } from 'next';
import SearchResult from './search-result';

interface Props {
  searchParams: { query: string };
}

export function generateMetadata({ searchParams: { query } }: Props): Metadata {
  return {
    title: `Search results for ${query}`,
  };
}

export default function Page({ searchParams: { query } }: Props) {
  return (
    <main className='grid grid-cols-[1fr_auto] items-start gap-8'>
      <div className='space-y-8'>
        <h2 className='line-clamp-2 break-all text-center text-2xl font-semibold'>
          Search results for "{query}"
        </h2>
        <SearchResult query={query} />
      </div>
      <Sidebar />
    </main>
  );
}
