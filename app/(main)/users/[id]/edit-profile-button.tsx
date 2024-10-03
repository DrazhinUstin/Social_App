'use client';

import { Button } from '@/app/components/ui/button';
import type { UserData } from '@/app/lib/types';
import { useState } from 'react';
import EditProfileDialog from './edit-profile-dialog';

export default function EditProfileButton({ user }: { user: UserData }) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>Edit Profile</Button>
      <EditProfileDialog isOpen={isDialogOpen} close={() => setIsDialogOpen(false)} user={user} />
    </>
  );
}
