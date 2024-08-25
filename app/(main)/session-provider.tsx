'use client';

import { createContext, useContext } from 'react';
import type { User, Session } from 'lucia';

interface SessionContext {
  user: User;
  session: Session;
}

const SessionContext = createContext<SessionContext | null>(null);

export default function SessionProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: SessionContext;
}) {
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export const useSession = () => {
  const session = useContext(SessionContext);
  if (!session) {
    throw Error('useSession must be used within <SessionContext.Provider>');
  }
  return session;
};
