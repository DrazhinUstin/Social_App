import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceStrict, format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  const currentDate = new Date();
  if (currentDate.getTime() - date.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceStrict(date, currentDate, { addSuffix: true });
  }
  return format(date, date.getFullYear() === currentDate.getFullYear() ? 'MMM d' : 'MMM d y');
}
