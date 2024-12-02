'use client';

import { useState } from 'react';
import { useUploadThing } from '@/app/lib/uploadthing';
import { useToast } from '@/app/hooks/use-toast';
import type { MediaType } from '@prisma/client';

interface UnUploadedAttachment {
  isUploaded: false;
  file: File;
  id?: undefined;
  url?: undefined;
  mediaType?: undefined;
}

interface UploadedAttachment {
  isUploaded: true;
  file?: undefined;
  id: string;
  url: string;
  mediaType: MediaType;
}

export type Attachment = UnUploadedAttachment | UploadedAttachment;

export const useAttachmentsUpload = (alreadyUploaded?: UploadedAttachment[]) => {
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<Attachment[]>(alreadyUploaded ?? []);
  const [uploadProgress, setUploadProgress] = useState<number>();

  const { isUploading, startUpload } = useUploadThing('postAttachment', {
    onBeforeUploadBegin(files) {
      const mappedFiles = files.map((file) => {
        const extension = file.name.split('.').pop();
        const newFileName = `attachment_${crypto.randomUUID()}.${extension}`;
        return new File([file], newFileName, { type: file.type });
      });
      setAttachments((prev) => [
        ...prev,
        ...mappedFiles.map((file) => ({ file, isUploaded: false as const })),
      ]);
      return mappedFiles;
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(data) {
      setAttachments((prev) =>
        prev.map((attachment) => {
          const uploadResult = data.find((item) => item.name === attachment.file?.name);
          if (uploadResult) {
            return { isUploaded: true, ...uploadResult.serverData };
          }
          return attachment;
        }),
      );
    },
    onUploadError(err) {
      setAttachments((prev) => prev.filter((attachment) => attachment.isUploaded));
      toast({
        variant: 'destructive',
        title: 'Failed to upload!',
        description: err.message,
      });
    },
  });

  function handleUpload(files: File[]) {
    if (isUploading) {
      toast({
        variant: 'destructive',
        description: 'Please wait until the upload is complete before uploading new files!',
      });
      return;
    }
    if (attachments.length + files.length > 4) {
      toast({
        variant: 'destructive',
        description: 'You can only upload up to 4 files per post!',
      });
      return;
    }
    const videos = attachments.filter((a) => a.mediaType === 'Video');
    const videoFiles = files.filter((file) => file.type.startsWith('video'));
    if (videos.length + videoFiles.length > 1) {
      toast({
        variant: 'destructive',
        description: 'You can only upload 1 video per post!',
      });
      return;
    }
    startUpload(files);
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
  }

  function resetUpload() {
    setAttachments([]);
    setUploadProgress(undefined);
  }

  return {
    attachments,
    uploadProgress,
    isUploading,
    startUpload: handleUpload,
    removeAttachment,
    resetUpload,
  };
};
