'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { SignUpFormSchema } from '@/app/lib/schemas';
import { signUp } from '@/app/(auth)/actions';
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

export default function SignUpForm() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof SignUpFormSchema>) {
    setErrorMsg(null);
    startTransition(async () => {
      const { error } = await signUp(values);
      if (error) setErrorMsg(error);
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-[90vw] max-w-[40rem] space-y-2 rounded-lg border bg-card p-4 text-card-foreground shadow-lg'
      >
        <h2 className='text-center text-2xl font-semibold'>Sign Up</h2>
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
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' placeholder='amadeus@mail.com' {...field} />
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
        <ButtonLoading type='submit' className='w-full' disabled={isPending}>
          Sign Up
        </ButtonLoading>
        <p className='text-center'>
          Already have an account?{' '}
          <Button variant='link' asChild>
            <Link href='/login'>Login</Link>
          </Button>
        </p>
      </form>
    </Form>
  );
}
