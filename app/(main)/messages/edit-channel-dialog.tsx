import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useToast } from '@/app/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

export default function EditChannelDialog({ onClose }: { onClose: () => void }) {
  const { channel } = useChatContext();
  const [channelName, setChannelName] = useState<string>(channel?.data?.name ?? '');
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async () => channel?.updatePartial({ set: { name: channelName } }),
    onSuccess: () => {
      onClose();
      toast({ description: 'The channel was successfully edited!' });
    },
    onError: (e) => {
      console.error(e);
      toast({ variant: 'destructive', description: 'Failed to edit a channel. Please try again.' });
    },
  });

  return (
    <Dialog open onOpenChange={(open) => !mutation.isPending && !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit channel</DialogTitle>
          <DialogDescription>
            Make changes to your channel here. Click edit when you're done.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label htmlFor='chatName' className='mb-2 block'>
            channel name:
          </Label>
          <Input
            id='chatName'
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            maxLength={100}
            autoFocus
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' disabled={mutation.isPending}>
              Close
            </Button>
          </DialogClose>
          <Button
            onClick={() => mutation.mutate()}
            disabled={
              !channelName.trim() || channel?.data?.name === channelName || mutation.isPending
            }
          >
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
