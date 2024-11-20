'use client';

import useInitializeChatClient from '@/app/hooks/use-initialize-chat-client';
import { Loader2 } from 'lucide-react';
import { Chat as StreamChat } from 'stream-chat-react';
import ChatSidebar from './chat-sidebar';
import ChatChannel from './chat-channel';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function Chat() {
  const client = useInitializeChatClient();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['unread-messages-count'] });
  }, []);

  if (!client) {
    return <Loader2 className='mx-auto animate-spin' />;
  }

  return (
    <div className='relative h-full'>
      <StreamChat client={client}>
        <div className='absolute bottom-0 top-0 flex w-full overflow-hidden rounded-lg border shadow-md'>
          <ChatSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <ChatChannel isSidebarOpen={isSidebarOpen} openSidebar={() => setIsSidebarOpen(true)} />
        </div>
      </StreamChat>
    </div>
  );
}
