import SignUpForm from './sign-up-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
};

export default function Page() {
  return (
    <main className='grid min-h-screen place-items-center'>
      <SignUpForm />
    </main>
  );
}
