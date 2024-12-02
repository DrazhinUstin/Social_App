import { ButtonLoading } from '@/app/components/button-loading';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { useToast } from '@/app/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { useChatContext } from 'stream-chat-react';

export default function DeleteChannelDialog({
  onClose,
  onChannelDeleted,
}: {
  onClose: () => void;
  onChannelDeleted: () => void;
}) {
  const { channel } = useChatContext();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async () => channel?.delete(),
    onSuccess: () => {
      onChannelDeleted();
      toast({ description: 'The channel was successfully deleted!' });
    },
    onError: (e) => {
      console.error(e);
      toast({
        variant: 'destructive',
        description: 'Failed to delete a channel. Please try again.',
      });
    },
  });

  return (
    <Dialog open onOpenChange={(open) => !mutation.isPending && !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete a channel?</DialogTitle>
          <DialogDescription>
            Are you sure that you want to delete a channel? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' disabled={mutation.isPending}>
              Close
            </Button>
          </DialogClose>
          <ButtonLoading
            variant='destructive'
            onClick={() => mutation.mutate()}
            isLoading={mutation.isPending}
          >
            Delete
          </ButtonLoading>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
