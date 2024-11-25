import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/app/components/ui/dropdown-menu';
import { cn } from '@/app/lib/utils';
import { EllipsisIcon, LogOutIcon, MenuIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import {
  Channel,
  ChannelHeader,
  type ChannelHeaderProps,
  MessageInput,
  MessageList,
  useChannelStateContext,
  Window,
} from 'stream-chat-react';
import { useSession } from '@/app/(main)/session-provider';
import EditChannelDialog from './edit-channel-dialog';
import DeleteChannelDialog from './delete-channel-dialog';
import LeaveChannelDialog from './leave-channel-dialog';

export default function ChatChannel({
  isSidebarOpen,
  openSidebar,
}: {
  isSidebarOpen: boolean;
  openSidebar: () => void;
}) {
  return (
    <div className={cn('w-full sm:block', isSidebarOpen && 'hidden')}>
      <Channel>
        <Window>
          <CustomChannelHeader onClick={openSidebar} />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
}

function CustomChannelHeader({ onClick, ...props }: ChannelHeaderProps & { onClick: () => void }) {
  const { members } = useChannelStateContext();
  const { user } = useSession();
  const isUserChannelOwner = members?.[user.id]?.role === 'owner';
  const [isEditChannelDialogOpen, setIsEditChannelDialogOpen] = useState<boolean>(false);
  const [isDeleteChannelDialogOpen, setIsDeleteChannelDialogOpen] = useState<boolean>(false);
  const [isLeaveChannelDialogOpen, setIsLeaveChannelDialogOpen] = useState<boolean>(false);
  return (
    <>
      <div className='flex items-center'>
        <Button variant='ghost' size='icon' className='shrink-0 sm:hidden' onClick={onClick}>
          <MenuIcon className='size-5' />
        </Button>
        <ChannelHeader {...props} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='ml-auto shrink-0'>
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {isUserChannelOwner ? (
              <>
                <DropdownMenuItem onClick={() => setIsEditChannelDialogOpen(true)}>
                  <PencilIcon className='mr-1 size-5 text-primary' />
                  <span>Edit channel</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDeleteChannelDialogOpen(true)}>
                  <Trash2Icon className='mr-1 size-5 text-destructive' />
                  <span className='text-destructive'>Delete channel</span>
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onClick={() => setIsLeaveChannelDialogOpen(true)}>
                <LogOutIcon className='mr-1 size-5 text-destructive' />
                <span className='text-destructive'>Leave channel</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isEditChannelDialogOpen && (
        <EditChannelDialog onClose={() => setIsEditChannelDialogOpen(false)} />
      )}
      {isDeleteChannelDialogOpen && (
        <DeleteChannelDialog
          onClose={() => setIsDeleteChannelDialogOpen(false)}
          onChannelDeleted={() => {
            setIsDeleteChannelDialogOpen(false);
            onClick();
          }}
        />
      )}
      {isLeaveChannelDialogOpen && (
        <LeaveChannelDialog
          onClose={() => setIsLeaveChannelDialogOpen(false)}
          onChannelLeaved={() => {
            setIsLeaveChannelDialogOpen(false);
            onClick();
          }}
        />
      )}
    </>
  );
}
