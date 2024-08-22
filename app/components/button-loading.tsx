import { Button, ButtonProps } from '@/app/components/ui/button';
import { Loader2 } from 'lucide-react';

interface Props extends ButtonProps {
  children: React.ReactNode;
}

export function ButtonLoading({ children, ...props }: Props) {
  return (
    <Button {...props}>
      {props.disabled && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
      {children}
    </Button>
  );
}
