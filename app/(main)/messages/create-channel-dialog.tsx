import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/app/components/ui/dialog';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSession } from '@/app/(main)/session-provider';
import { type DefaultStreamChatGenerics, useChatContext } from 'stream-chat-react';
import type { UserResponse } from 'stream-chat';
import { Input } from '@/app/components/ui/input';
import useDebounce from '@/app/hooks/useDebounce';
import { CheckIcon, Loader2, XIcon } from 'lucide-react';
import UserAvatar from '@/app/components/user-avatar';
import { useToast } from '@/app/hooks/use-toast';

export default function CreateChannelDialog({
  onClose,
  onChannelCreated,
}: {
  onClose: () => void;
  onChannelCreated: () => void;
}) {
  const { client, setActiveChannel } = useChatContext();
  const { user: loggedInUser } = useSession();
  const [selectedUsers, setSelectedUsers] = useState<UserResponse<DefaultStreamChatGenerics>[]>([]);
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query);
  const { toast } = useToast();

  const { isLoading, status, data } = useQuery({
    queryKey: ['stream-users-search', debouncedQuery],
    queryFn: () =>
      client
        .queryUsers(
          {
            role: 'user',
            $or: [
              { name: { $autocomplete: debouncedQuery } },
              { username: { $autocomplete: debouncedQuery } },
            ],
          },
          [{ name: 1 }, { username: 1 }],
          { limit: 10 },
        )
        .then((data) => data.users.filter((user) => user.id !== loggedInUser.id)),
    enabled: !!debouncedQuery,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const channel = client.channel('messaging', {
        members: [loggedInUser.id, ...selectedUsers.map((user) => user.id)],
        name:
          selectedUsers.length > 1
            ? loggedInUser.displayName + ', ' + selectedUsers.map((user) => user.name).join(', ')
            : selectedUsers[0].name,
      });
      await channel.create();
      setActiveChannel(channel);
    },
    onSuccess: () => {
      onChannelCreated();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Oops! Failed to create a channel.',
        description: error.message,
      });
    },
  });

  return (
    <Dialog open onOpenChange={(open) => !open && !mutation.isPending && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New channel</DialogTitle>
          <DialogDescription>Search users to start a chat with</DialogDescription>
        </DialogHeader>
        <div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Enter user name...'
            autoFocus
          />
        </div>
        {!!selectedUsers.length && (
          <div className='flex flex-wrap gap-2'>
            {selectedUsers.map((user) => (
              <SelectedUserTab
                key={user.id}
                user={user}
                onClick={() => setSelectedUsers((prev) => prev.filter(({ id }) => id !== user.id))}
              />
            ))}
          </div>
        )}
        {status === 'error' && (
          <p className='text-center text-destructive'>
            Sorry, there was an error while searching users. Please try again.
          </p>
        )}
        {status === 'success' &&
          (!!data.length ? (
            <SearchResult
              users={data}
              selectedUsers={selectedUsers}
              onUserSelected={(user) =>
                setSelectedUsers((prev) =>
                  prev.some(({ id }) => id === user.id)
                    ? prev.filter(({ id }) => id !== user.id)
                    : [...prev, user],
                )
              }
            />
          ) : (
            <p className='text-center text-muted-foreground'>
              No users were found for your search...
            </p>
          ))}
        {isLoading && <Loader2 className='mx-auto animate-spin' />}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' disabled={mutation.isPending}>
              Close
            </Button>
          </DialogClose>
          <Button
            onClick={() => mutation.mutate()}
            disabled={!selectedUsers.length || mutation.isPending}
          >
            Create a channel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SearchResult({
  users,
  selectedUsers,
  onUserSelected,
}: {
  users: UserResponse<DefaultStreamChatGenerics>[];
  selectedUsers: UserResponse<DefaultStreamChatGenerics>[];
  onUserSelected: (user: UserResponse<DefaultStreamChatGenerics>) => void;
}) {
  return (
    <ul className='space-y-2'>
      {users.map((user) => (
        <li
          key={user.id}
          onClick={() => onUserSelected(user)}
          className='flex cursor-pointer items-center justify-between gap-2'
        >
          <div className='grid grid-cols-[auto_1fr] items-center gap-2'>
            <UserAvatar src={user.image} className='size-8' />
            <div>
              <h4>{user.name}</h4>
              <p className='text-sm text-muted-foreground'>@{user.username}</p>
            </div>
          </div>
          {selectedUsers.some(({ id }) => id === user.id) && (
            <span className='shrink-0'>
              <CheckIcon className='size-5 text-primary' />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function SelectedUserTab({
  user,
  onClick,
}: {
  user: UserResponse<DefaultStreamChatGenerics>;
  onClick: () => void;
}) {
  return (
    <button className='flex items-center gap-2 rounded-full border p-2' onClick={onClick}>
      <UserAvatar src={user.image} className='size-6' />
      {user.name}
      <XIcon className='size-4' />
    </button>
  );
}
