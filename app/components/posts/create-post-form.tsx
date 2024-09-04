'use client';

import { useState } from 'react';
import { createPost } from '@/app/(main)/actions';
import UserAvatar from '@/app/components/user-avatar';
import Editor from '@/app/components/editor';
import { ButtonLoading } from '@/app/components/button-loading';

export default function CreatePostForm() {
  const [content, setContent] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createPost(content);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-2 rounded-lg border bg-card p-4 shadow-md'>
      <div className='grid grid-cols-[auto_1fr] items-center gap-2'>
        <UserAvatar />
        <Editor handleUpdate={setContent} />
      </div>
      <div className='text-right'>
        <ButtonLoading disabled={!content}>Make a Post</ButtonLoading>
      </div>
    </form>
  );
}
