import type { UserData } from '@/app/lib/types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditProfileSchema } from '@/app/lib/schemas';
import { useEditProfileMutation } from './mutations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/app/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import { ButtonLoading } from '@/app/components/button-loading';

export default function EditProfileDialog({
  isOpen,
  close,
  user,
}: {
  isOpen: boolean;
  close: () => void;
  user: UserData;
}) {
  const form = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      displayName: user.displayName,
      bio: user.bio ?? '',
    },
  });

  const mutation = useEditProfileMutation();

  function onSubmit(values: z.infer<typeof EditProfileSchema>) {
    mutation.mutate(values, { onSuccess: close });
  }

  const handleOpenChange = (open: boolean) => {
    if (!open && !mutation.isPending) close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='displayName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name:</FormLabel>
                  <FormControl>
                    <Input placeholder='Wolfgang Amadeus' {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='bio'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio:</FormLabel>
                  <FormControl>
                    <Textarea className='resize-none' {...field} />
                  </FormControl>
                  <FormDescription>Add a short bio about yourself.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type='button' variant='outline'>
                  Close
                </Button>
              </DialogClose>
              <ButtonLoading type='submit' disabled={mutation.isPending}>
                Save
              </ButtonLoading>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}