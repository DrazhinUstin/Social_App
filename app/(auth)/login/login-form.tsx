'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { LoginFormSchema } from '@/app/lib/schemas';
import { login } from '@/app/(auth)/actions';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { ButtonLoading } from '@/app/components/button-loading';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { InputPassword } from '@/app/components/input-password';
import GithubButton from './github-button';
import GoogleButton from './google-button';

export default function LoginForm() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    setErrorMsg(null);
    startTransition(async () => {
      const { error } = await login(values);
      if (error) setErrorMsg(error);
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full max-w-[40rem] space-y-2 rounded-lg border bg-card p-4 text-card-foreground shadow-md'
      >
        <h2 className='text-center text-2xl font-semibold'>Login</h2>
        {errorMsg && <p className='text-center text-sm text-destructive'>{errorMsg}</p>}
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='amadeus' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <InputPassword {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ButtonLoading type='submit' className='w-full' isLoading={isPending}>
          Login
        </ButtonLoading>
        <div className='flex items-center gap-2 text-sm'>
          <div className='h-[1px] w-full bg-muted' />
          OR
          <div className='h-[1px] w-full bg-muted' />
        </div>
        <GithubButton />
        <GoogleButton />
        <p className='text-center'>
          Don't have an account?{' '}
          <Button variant='link' asChild>
            <Link href='/signup'>Sign up</Link>
          </Button>
        </p>
      </form>
    </Form>
  );
}
