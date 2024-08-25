import { redirect } from 'next/navigation';
import { validateRequest } from '@/auth';
import SessionProvider from './session-provider';

export default async function layout({ children }: { children: React.ReactNode }) {
  const session = await validateRequest();
  if (!session.user) {
    return redirect('/login');
  }
  return (
    <div>
      <SessionProvider value={session}>{children}</SessionProvider>
    </div>
  );
}
