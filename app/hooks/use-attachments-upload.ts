'use client';

import { useState } from 'react';
import { useUploadThing } from '@/app/lib/uploadthing';
import { useToast } from '@/app/hooks/use-toast';

export interface Attachment {
  file: File;
  isUploaded: boolean;
  dbEntryId?: string;
}

export const useAttachmentsUpload = () => {
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
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
        ...mappedFiles.map((file) => ({ file, isUploaded: false })),
      ]);
      return mappedFiles;
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(data) {
      setAttachments((prev) =>
        prev.map((attachment) => {
          const uploadResult = data.find((item) => item.name === attachment.file.name);
          if (uploadResult) {
            return { ...attachment, isUploaded: true, dbEntryId: uploadResult.serverData.id };
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
    if (attachments.length + files.length > 5) {
      toast({
        variant: 'destructive',
        description: 'You can only upload up to 5 files!',
      });
      return;
    }
    startUpload(files);
  }

  function removeAttachment(fileName: string) {
    setAttachments((prev) => prev.filter((attachment) => attachment.file.name !== fileName));
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
