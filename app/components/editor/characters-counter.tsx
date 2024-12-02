import type { Editor } from '@tiptap/react';

export default function CharactersCounter({ editor, limit }: { editor: Editor; limit: number }) {
  const count = editor.storage.characterCount.characters();

  if (count === 0) {
    return null;
  }

  return (
    <p className='absolute -bottom-4 left-0 text-xs tabular-nums text-muted-foreground'>
      <span className={count >= limit ? 'text-destructive' : undefined}>{count}</span> / {limit}
    </p>
  );
}
