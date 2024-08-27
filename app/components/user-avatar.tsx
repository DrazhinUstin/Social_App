import Image, { ImageProps } from 'next/image';
import { cn } from '@/app/lib/utils';
import default_avatar from '@/public/default_avatar.png';

export default function UserAvatar({
  src,
  width,
  height,
  className,
  ...rest
}: Omit<ImageProps, 'src' | 'alt'> & { src?: ImageProps['src'] | null }) {
  return (
    <Image
      src={src ?? default_avatar}
      alt='user avatar'
      width={width ?? 40}
      height={height ?? 40}
      className={cn('block flex-none rounded-full object-cover', className)}
      {...rest}
    />
  );
}
