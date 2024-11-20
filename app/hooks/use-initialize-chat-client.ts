import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { api } from '@/app/lib/api';
import { useSession } from '@/app/(main)/session-provider';

export default function useInitializeChatClient() {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const { user } = useSession();

  useEffect(() => {
    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY!);

    client
      .connectUser(
        { id: user.id, username: user.username, name: user.displayName, image: user.avatarUrl },
        async () =>
          api('/api/stream/get-token')
            .then((res) => res.json<{ token: string }>())
            .then((data) => data.token),
      )
      .then(() => setChatClient(client))
      .catch((err) => console.error('Failed to connect a user', err));

    return () => {
      setChatClient(null);
      client.disconnectUser().catch((err) => console.error('Failed to disconnect a user', err));
    };
  }, [user.id, user.username, user.displayName, user.avatarUrl]);

  return chatClient;
}
