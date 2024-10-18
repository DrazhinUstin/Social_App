import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Button } from '@/app/components/ui/button';
import { EllipsisIcon, Trash2Icon } from 'lucide-react';
import DeleteCommentDialog from './delete-comment-dialog';

export default function CommentCardMenu({ commentId }: { commentId: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' className='size-6'>
            <EllipsisIcon className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className='text-destructive focus:text-destructive'
            onClick={() => setIsDialogOpen(true)}
          >
            <Trash2Icon className='mr-2 size-4' />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteCommentDialog
        commentId={commentId}
        isOpen={isDialogOpen}
        close={() => setIsDialogOpen(false)}
      />
    </>
  );
}
