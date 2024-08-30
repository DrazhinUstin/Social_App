import Link from 'next/link';
import SearchField from './search-field';
import UserMenu from './user-menu';

export default async function Navbar() {
  return (
    <header className='sticky top-0 z-50 bg-card text-card-foreground shadow-md'>
      <div className='mx-auto flex h-[var(--navbar-height)] w-[90vw] max-w-7xl items-center justify-between gap-2'>
        <SearchField />
        <Link href='/'>
          <h2 className='text-2xl font-semibold text-primary'>Social App</h2>
        </Link>
        <UserMenu />
      </div>
    </header>
  );
}
