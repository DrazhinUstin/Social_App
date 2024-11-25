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
import { useSession } from '@/app/(main)/session-provider';

export default function LeaveChannelDialog({
  onClose,
  onChannelLeaved,
}: {
  onClose: () => void;
  onChannelLeaved: () => void;
}) {
  const { channel, setActiveChannel } = useChatContext();
  const { user } = useSession();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async () => channel?.removeMembers([user.id]),
    onSuccess: () => {
      setActiveChannel(undefined);
      onChannelLeaved();
      toast({ description: 'You successfully leaved a channel!' });
    },
    onError: (e) => {
      console.error(e);
      toast({
        variant: 'destructive',
        description: 'Failed to leave a channel. Please try again.',
      });
    },
  });

  return (
    <Dialog open onOpenChange={(open) => !mutation.isPending && !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave a channel?</DialogTitle>
          <DialogDescription>
            Are you sure that you want to leave a channel? This action cannot be undone.
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
            disabled={mutation.isPending}
          >
            Leave
          </ButtonLoading>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
