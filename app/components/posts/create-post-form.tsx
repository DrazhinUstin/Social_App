'use client';

import { useRef, useState } from 'react';
import { useCreatePostMutation } from '@/app/(main)/mutations';
import { useAttachmentsUpload, type Attachment } from '@/app/hooks/use-attachments-upload';
import { useDropzone } from '@uploadthing/react';
import UserAvatar from '@/app/components/user-avatar';
import Editor from '@/app/components/editor';
import { ButtonLoading } from '@/app/components/button-loading';
import { Button } from '@/app/components/ui/button';
import { Loader2, PaperclipIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/app/lib/utils';

export default function CreatePostForm() {
  const [content, setContent] = useState<string>('');
  const mutation = useCreatePostMutation();
  const { isUploading, startUpload, uploadProgress, attachments, removeAttachment, resetUpload } =
    useAttachmentsUpload();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: startUpload });
  const { onClick, ...rootProps } = getRootProps();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(
      { content, attachmentIds: attachments.map(({ dbEntryId }) => dbEntryId as string) },
      {
        onSuccess() {
          resetUpload();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-2 rounded-lg border bg-card p-4 shadow-md'>
      <div className='grid grid-cols-[auto_1fr] items-center gap-2'>
        <UserAvatar />
        <div {...rootProps} className={cn(isDragActive && 'outline-dotted outline-primary')}>
          <Editor
            handleUpdate={setContent}
            onPaste={(e) => startUpload([...e.clipboardData.files])}
          />
          <input {...getInputProps()} />
        </div>
      </div>
      <div className='flex items-center justify-end gap-2'>
        {isUploading && uploadProgress !== undefined && (
          <span className='flex items-center gap-1'>
            {uploadProgress}%
            <Loader2 className='animate-spin text-primary' />
          </span>
        )}
        <AddAttachmentButton onFilesSelected={startUpload} />
        <ButtonLoading type='submit' disabled={mutation.isPending || isUploading}>
          Make a Post
        </ButtonLoading>
      </div>
      {!!attachments.length && (
        <PostAttachments
          isUploading={isUploading}
          attachments={attachments}
          onRemoveClick={removeAttachment}
        />
      )}
    </form>
  );
}

function AddAttachmentButton({ onFilesSelected }: { onFilesSelected: (files: File[]) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    onFilesSelected([...(files ?? [])]);
    e.target.value = '';
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*, video/*'
        className='sr-only hidden'
        multiple
        onChange={handleChange}
      />
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className='text-muted-foreground hover:text-primary'
        onClick={() => fileInputRef.current?.click()}
      >
        <PaperclipIcon />
      </Button>
    </>
  );
}

function PostAttachments({
  isUploading,
  attachments,
  onRemoveClick,
}: {
  isUploading: boolean;
  attachments: Attachment[];
  onRemoveClick: (fileName: string) => void;
}) {
  return (
    <div className='flex flex-wrap items-center justify-end gap-3'>
      {attachments.map(({ file }) => {
        const url = URL.createObjectURL(file);
        return (
          <div key={file.name} className={cn('relative', isUploading && 'opacity-75')}>
            {file.type.startsWith('image') ? (
              <Image
                src={url}
                alt='post image'
                width={100}
                height={100}
                className='block w-full max-w-24'
                onLoad={() => URL.revokeObjectURL(url)}
              />
            ) : (
              <video className='block w-full max-w-24' controls>
                <source src={url} type={file.type} onLoad={() => URL.revokeObjectURL(url)} />
              </video>
            )}
            {!isUploading && (
              <button
                type='button'
                className='absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-destructive text-destructive-foreground'
                onClick={() => onRemoveClick(file.name)}
              >
                <XIcon className='size-4' />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
