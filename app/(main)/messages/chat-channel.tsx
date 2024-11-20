import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils';
import { MenuIcon } from 'lucide-react';
import {
  Channel,
  ChannelHeader,
  type ChannelHeaderProps,
  MessageInput,
  MessageList,
  Window,
} from 'stream-chat-react';

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
  return (
    <div className='flex items-center'>
      <Button variant='ghost' size='icon' className='shrink-0 sm:hidden' onClick={onClick}>
        <MenuIcon className='size-5' />
      </Button>
      <ChannelHeader {...props} />
    </div>
  );
}
