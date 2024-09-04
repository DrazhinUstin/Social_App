import { Editor, BubbleMenu as Menu } from '@tiptap/react';
import { Button } from '@/app/components/ui/button';

export default function BubbleMenu({ editor }: { editor: Editor }) {
  return (
    <Menu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className='flex rounded-lg border bg-card p-1 shadow-md'
    >
      <Button
        type='button'
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-accent text-accent-foreground' : ''}
      >
        Bold
      </Button>
      <Button
        type='button'
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-accent text-accent-foreground' : ''}
      >
        Italic
      </Button>
      <Button
        type='button'
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'bg-accent text-accent-foreground' : ''}
      >
        Strike
      </Button>
    </Menu>
  );
}
