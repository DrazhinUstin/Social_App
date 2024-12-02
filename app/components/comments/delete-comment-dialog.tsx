import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { ButtonLoading } from '@/app/components/button-loading';
import { Button } from '@/app/components/ui/button';
import { useDeleteCommentMutation } from './mutations';

export default function DeleteCommentDialog({
  isOpen,
  close,
  commentId,
}: {
  isOpen: boolean;
  close: () => void;
  commentId: string;
}) {
  const mutation = useDeleteCommentMutation();

  const handleDelete = () => {
    mutation.mutate(commentId, { onSuccess: () => close() });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !mutation.isPending && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete a comment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete a comment? This cannot be undone.
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
            <Button type='button' variant='secondary' disabled={mutation.isPending}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
