import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/app/components/ui/dropdown-menu';
import { Button } from '@/app/components/ui/button';
import EditPostDialog from './edit-post-dialog';
import DeletePostDialog from './delete-post-dialog';
import { Ellipsis, Pencil, Trash2 } from 'lucide-react';
import type { PostData } from '@/app/lib/types';

export default function PostCardMenu({ className, post }: { className?: string; post: PostData }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  return (
    <>
      <div className={className}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size='icon' variant='ghost'>
              <Ellipsis className='size-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
              <Pencil className='mr-2 size-4 text-primary' />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className='mr-2 size-4 text-destructive' />
              <span className='text-destructive'>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isEditDialogOpen && <EditPostDialog close={() => setIsEditDialogOpen(false)} post={post} />}
      {isDeleteDialogOpen && (
        <DeletePostDialog close={() => setIsDeleteDialogOpen(false)} postId={post.id} />
      )}
    </>
  );
}
