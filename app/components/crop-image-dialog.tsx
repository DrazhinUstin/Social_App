import React, { useRef } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';

export default function CropImageDialog({
  imageUrl,
  handleBlob,
  closeDialog,
}: {
  imageUrl: string;
  handleBlob: (blob: Blob) => void;
  closeDialog: () => void;
}) {
  const cropperRef = useRef<ReactCropperElement>(null);

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    cropper.getCroppedCanvas().toBlob((blob) => blob && handleBlob(blob));
    closeDialog();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogDescription>
            Select an area to crop. Click crop when you're done.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Cropper
            src={imageUrl}
            className='m-auto size-fit'
            initialAspectRatio={1}
            guides={false}
            ref={cropperRef}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button onClick={handleCrop}>Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
