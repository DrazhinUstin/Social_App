import { Button, ButtonProps } from '@/app/components/ui/button';
import { Loader2 } from 'lucide-react';

interface Props extends ButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export function ButtonLoading({ children, isLoading, ...props }: Props) {
  return (
    <Button {...props} disabled={isLoading || props.disabled}>
      {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
      {children}
    </Button>
  );
}
