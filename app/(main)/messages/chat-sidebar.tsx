import {
  ChannelList,
  ChannelPreviewMessenger,
  type ChannelPreviewUIComponentProps,
} from 'stream-chat-react';
import { useSession } from '@/app/(main)/session-provider';
import { Button } from '@/app/components/ui/button';
import { MailPlusIcon, XIcon } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { useCallback, useState } from 'react';
import CreateChannelDialog from './create-channel-dialog';

export default function ChatSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useSession();
  const [isCreateChannelDialogOpen, setIsCreateChannelDialogOpen] = useState<boolean>(false);

  const CustomChannelPreview = useCallback((props: ChannelPreviewUIComponentProps) => {
    const { channel, setActiveChannel } = props;
    const handleSelect = () => {
      setActiveChannel?.(channel);
      onClose();
    };
    return <ChannelPreviewMessenger {...props} onSelect={handleSelect} />;
  }, []);

  return (
    <>
      <aside className={cn('w-full sm:block sm:max-w-[320px] sm:border-r', !isOpen && 'hidden')}>
        <div className='flex items-center justify-between gap-x-4 px-4 py-2'>
          <Button variant='ghost' size='icon' className='sm:hidden' onClick={onClose}>
            <XIcon className='size-5' />
          </Button>
          <h2 className='text-xl font-semibold'>Messages</h2>
          <Button
            variant='ghost'
            size='icon'
            title='create a new channel'
            onClick={() => setIsCreateChannelDialogOpen(true)}
          >
            <MailPlusIcon className='size-5' />
          </Button>
        </div>
        <ChannelList
          filters={{ type: 'messaging', members: { $in: [user.id] } }}
          sort={{ last_message_at: -1 }}
          options={{ limit: 10 }}
          showChannelSearch
          additionalChannelSearchProps={{
            searchForChannels: true,
            searchQueryParams: {
              channelFilters: { filters: { type: 'messaging', members: { $in: [user.id] } } },
            },
          }}
          Preview={CustomChannelPreview}
        />
      </aside>
      {isCreateChannelDialogOpen && (
        <CreateChannelDialog
          onClose={() => setIsCreateChannelDialogOpen(false)}
          onChannelCreated={() => {
            setIsCreateChannelDialogOpen(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
