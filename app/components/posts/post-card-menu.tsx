import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/app/components/ui/dropdown-menu';
import { Button } from '@/app/components/ui/button';
import DeletePostDialog from './delete-post-dialog';
import { Ellipsis, Trash2 } from 'lucide-react';

export default function PostCardMenu({
  className,
  postId,
}: {
  className?: string;
  postId: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
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
            <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
              <Trash2 className='mr-2 size-4 text-destructive' />
              <span className='text-destructive'>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DeletePostDialog
        isOpen={isDialogOpen}
        close={() => setIsDialogOpen(false)}
        postId={postId}
      />
    </>
  );
}
