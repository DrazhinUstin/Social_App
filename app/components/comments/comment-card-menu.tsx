import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Button } from '@/app/components/ui/button';
import { EllipsisIcon, PenIcon, Trash2Icon } from 'lucide-react';
import DeleteCommentDialog from './delete-comment-dialog';
import type { CommentData } from '@/app/lib/types';
import EditCommentDialog from './edit-comment-dialog';

export default function CommentCardMenu({ comment }: { comment: CommentData }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' className='size-6'>
            <EllipsisIcon className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <PenIcon className='mr-2 size-4 text-primary' />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className='text-destructive focus:text-destructive'
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2Icon className='mr-2 size-4' />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditCommentDialog
        comment={comment}
        isOpen={isEditDialogOpen}
        close={() => setIsEditDialogOpen(false)}
      />
      <DeleteCommentDialog
        commentId={comment.id}
        isOpen={isDeleteDialogOpen}
        close={() => setIsDeleteDialogOpen(false)}
      />
    </>
  );
}
