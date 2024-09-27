import { LinkItEmail, LinkIt } from 'react-linkify-it';
import UserMention from './user-mention';

export default function Linkify({ children }: { children: React.ReactNode }) {
  return (
    <LinkItEmail className='text-primary hover:underline'>
      <LinkItMention>{children}</LinkItMention>
    </LinkItEmail>
  );
}

function LinkItMention({ children }: { children: React.ReactNode }) {
  return (
    <LinkIt
      component={(match, key) => (
        <UserMention key={key} username={match.slice(1)}>
          {match}
        </UserMention>
      )}
      regex={/\B@\w+/g}
    >
      {children}
    </LinkIt>
  );
}
