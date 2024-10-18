import { Input } from '@/app/components/ui/input';
import { useCreateCommentMutation } from './mutations';
import { useState } from 'react';
import { Loader2, SendIcon } from 'lucide-react';
import { Button } from '../ui/button';

export default function CreateCommentForm({ postId }: { postId: string }) {
  const [input, setInput] = useState<string>('');
  const mutation = useCreateCommentMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ input, postId }, { onSuccess: () => setInput('') });
  };

  return (
    <form onSubmit={handleSubmit} className='flex gap-2'>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Start writing a comment...'
        autoFocus
      />
      <Button type='submit' size='icon' disabled={!input.trim() || mutation.isPending}>
        {mutation.isPending ? (
          <Loader2 className='size-5 animate-spin' />
        ) : (
          <SendIcon className='size-5' />
        )}
      </Button>
    </form>
  );
}
