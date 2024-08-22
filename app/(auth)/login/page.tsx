import LoginForm from './login-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
};

export default function Page() {
  return (
    <main className='grid h-screen place-items-center'>
      <LoginForm />
    </main>
  );
}
