'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import BubbleMenu from './bubble-menu';
import FloatingMenu from './floating-menu';
import './styles.css';

export default function Editor({
  initialContent,
  handleUpdate,
}: {
  initialContent?: string;
  handleUpdate: (p: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
        heading: {
          levels: [3],
          HTMLAttributes: {
            class: 'text-xl font-semibold',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc space-y-1 pl-6 marker:text-primary',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal space-y-1 pl-6 marker:text-primary',
          },
        },
      }),
      Placeholder.configure({
        placeholder: "What's new?",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          'max-h-20 w-full space-y-2 overflow-y-auto break-all rounded-lg border border-input bg-background p-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      },
    },
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      handleUpdate(html);
    },
    immediatelyRender: false,
  });

  return (
    <div>
      {editor && <BubbleMenu editor={editor} />}
      {editor && <FloatingMenu editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
