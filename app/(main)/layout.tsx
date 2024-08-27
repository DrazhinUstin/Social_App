import { redirect } from 'next/navigation';
import { validateRequest } from '@/auth';
import SessionProvider from './session-provider';
import Navbar from './_navbar';

export default async function layout({ children }: { children: React.ReactNode }) {
  const session = await validateRequest();
  if (!session.user) {
    return redirect('/login');
  }
  return (
    <div>
      <SessionProvider value={session}>
        <Navbar />
        {children}
      </SessionProvider>
    </div>
  );
}
