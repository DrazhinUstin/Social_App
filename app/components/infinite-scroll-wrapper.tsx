'use client';

import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export default function InfiniteScrollWrapper({
  children,
  className,
  onEndReached,
}: {
  children: React.ReactNode;
  className?: string;
  onEndReached: () => void;
}) {
  const { ref, inView } = useInView();

  useEffect(() => {
    inView && onEndReached();
  }, [inView]);

  return (
    <div className={className}>
      {children}
      <div ref={ref}></div>
    </div>
  );
}
