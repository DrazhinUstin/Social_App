'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import type { PostData } from '@/app/lib/types';
import { useRef, useState } from 'react';
import Editor from '@/app/components/editor';
import { Loader2, PaperclipIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/app/lib/utils';
import { type Attachment, useAttachmentsUpload } from '@/app/hooks/use-attachments-upload';
import { useDropzone } from '@uploadthing/react';
import { useEditPostMutation } from '@/app/(main)/mutations';

export default function EditPostDialog({ close, post }: { close: () => void; post: PostData }) {
  const [content, setContent] = useState<string>(post.content);
  const { isUploading, startUpload, uploadProgress, attachments, removeAttachment, resetUpload } =
    useAttachmentsUpload(post.attachments.map((a) => ({ isUploaded: true, ...a })));
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: startUpload });
  const { onClick, ...rootProps } = getRootProps();
  const mutation = useEditPostMutation();

  const handleEdit = () => {
    mutation.mutate(
      {
        postId: post.id,
        data: { content, attachmentIds: attachments.map(({ id }) => id as string) },
      },
      {
        onSuccess() {
          resetUpload();
          close();
        },
      },
    );
  };

  return (
    <Dialog open onOpenChange={(open) => !mutation.isPending && !isUploading && !open && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit post</DialogTitle>
          <DialogDescription>
            Make changes to your post and then click edit button.
          </DialogDescription>
        </DialogHeader>
        <div {...rootProps} className={cn(isDragActive && 'outline-dotted outline-primary')}>
          <Editor
            initialContent={content}
            handleUpdate={setContent}
            onPaste={(e) => e.clipboardData.files.length && startUpload([...e.clipboardData.files])}
          />
          <input {...getInputProps()} />
        </div>
        {!!attachments.length && (
          <PostAttachments
            isUploading={isUploading}
            attachments={attachments}
            onRemoveClick={removeAttachment}
          />
        )}
        <DialogFooter>
          {isUploading && uploadProgress !== undefined && (
            <span className='flex items-center gap-1'>
              {uploadProgress}%
              <Loader2 className='animate-spin text-primary' />
            </span>
          )}
          <AddAttachmentButton onFilesSelected={startUpload} />
          <Button onClick={handleEdit} disabled={!content || mutation.isPending || isUploading}>
            Edit
          </Button>
          <DialogClose asChild>
            <Button variant='outline' disabled={mutation.isPending || isUploading}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
  onRemoveClick: (id: string) => void;
}) {
  return (
    <div className='flex flex-wrap items-center justify-end gap-3'>
      {attachments.map(({ id, file, url, mediaType }) => {
        const src = file ? URL.createObjectURL(file) : url;
        return (
          <div key={id ?? file.name} className={cn('relative', isUploading && 'opacity-75')}>
            {file?.type.startsWith('image') || mediaType === 'Image' ? (
              <Image
                src={src}
                alt='post image'
                width={100}
                height={100}
                className='block w-full max-w-24'
              />
            ) : (
              <video className='block w-full max-w-24' controls>
                <source src={src} type={file?.type} />
              </video>
            )}
            {!isUploading && (
              <button
                type='button'
                className='absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-destructive text-destructive-foreground'
                onClick={() => onRemoveClick(id as string)}
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
