'use client';

import { useDeletePostMutation } from '@/app/(main)/mutations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { ButtonLoading } from '@/app/components/button-loading';

export default function DeletePostDialog({ close, postId }: { close: () => void; postId: string }) {
  const mutation = useDeletePostMutation();

  const handleOpenChange = (open: boolean) => {
    if (!open && !mutation.isPending) close();
  };

  const handleDelete = () => {
    mutation.mutate(postId, { onSuccess: close });
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete a post?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete a post? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <ButtonLoading
            variant='destructive'
            onClick={handleDelete}
            isLoading={mutation.isPending}
          >
            Delete
          </ButtonLoading>
          <DialogClose asChild>
            <Button variant='outline' disabled={mutation.isPending}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
