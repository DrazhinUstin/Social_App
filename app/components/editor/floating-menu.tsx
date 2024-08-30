import { Editor, FloatingMenu as Menu } from '@tiptap/react';
import { Button } from '@/app/components/ui/button';
import { HeadingIcon, ListIcon, ListOrderedIcon } from 'lucide-react';

export default function FloatingMenu({ editor }: { editor: Editor }) {
  return (
    <Menu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className='flex rounded-lg border bg-card p-1 shadow-md'
    >
      <Button
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          editor.isActive('heading', { level: 3 }) ? 'bg-accent text-accent-foreground' : ''
        }
      >
        <HeadingIcon className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-accent text-accent-foreground' : ''}
      >
        <ListIcon className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-accent text-accent-foreground' : ''}
      >
        <ListOrderedIcon className='h-4 w-4' />
      </Button>
    </Menu>
  );
}
