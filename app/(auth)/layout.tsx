import { redirect } from 'next/navigation';
import { validateRequest } from '@/auth';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { user } = await validateRequest();
  if (user) {
    return redirect('/');
  }
  return <div className='mx-auto w-[90vw] max-w-7xl'>{children}</div>;
}
