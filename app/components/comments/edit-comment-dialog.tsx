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
import { useEditCommentMutation } from './mutations';
import { useState } from 'react';
import type { CommentData } from '@/app/lib/types';
import { Textarea } from '@/app/components/ui/textarea';

export default function EditCommentDialog({
  isOpen,
  close,
  comment,
}: {
  isOpen: boolean;
  close: () => void;
  comment: CommentData;
}) {
  const [input, setInput] = useState<string>(comment.content);
  const mutation = useEditCommentMutation();

  const handleEdit = () => {
    mutation.mutate({ commentId: comment.id, input }, { onSuccess: () => close() });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !mutation.isPending && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit a comment</DialogTitle>
          <DialogDescription>
            Make changes to your comment and then click the edit button.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Start editing a comment...'
            autoFocus
          />
        </div>
        <DialogFooter>
          <ButtonLoading
            onClick={handleEdit}
            disabled={!input.trim()}
            isLoading={mutation.isPending}
          >
            Edit
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
