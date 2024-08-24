'use client';

import { forwardRef, useState } from 'react';
import { cn } from '@/app/lib/utils';
import { Input, InputProps } from '@/app/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

export const InputPassword = forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  ({ className, ...props }, ref) => {
    const [hiddenInput, setHiddenInput] = useState<boolean>(false);
    return (
      <div className='relative'>
        <Input
          {...props}
          type={hiddenInput ? 'password' : 'text'}
          className={cn(className, 'pr-8')}
          ref={ref}
        />
        <button
          type='button'
          className='absolute right-[0.375rem] top-1/2 -translate-y-1/2 text-muted-foreground'
          onClick={() => setHiddenInput(!hiddenInput)}
        >
          {hiddenInput ? <Eye /> : <EyeOff />}
        </button>
      </div>
    );
  },
);
