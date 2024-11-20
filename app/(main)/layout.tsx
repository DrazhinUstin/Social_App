import { redirect } from 'next/navigation';
import { validateRequest } from '@/auth';
import SessionProvider from './session-provider';
import Navbar from './components/navbar';
import Menubar from './components/menubar';

export default async function layout({ children }: { children: React.ReactNode }) {
  const session = await validateRequest();
  if (!session.user) {
    return redirect('/login');
  }
  return (
    <div>
      <SessionProvider value={session}>
        <Navbar />
        <div className='mx-auto grid min-h-[calc(100vh-var(--navbar-height))] w-[90vw] max-w-7xl grid-rows-[1fr_auto] items-start gap-8 py-8 sm:grid-cols-[auto_1fr]'>
          <Menubar />
          <div className='-order-1 h-full sm:order-none'>{children}</div>
        </div>
      </SessionProvider>
    </div>
  );
}
