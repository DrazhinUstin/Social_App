'use client';

import { useSession } from '@/app/(main)/session-provider';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@/app/components/ui/dropdown-menu';
import UserAvatar from '@/app/components/user-avatar';
import { User, Palette, Monitor, Sun, Moon, Check, LogOut } from 'lucide-react';
import { logout } from '@/app/(auth)/actions';

const themes = [
  { name: 'system', icon: <Monitor className='mr-2 h-4 w-4' /> },
  { name: 'light', icon: <Sun className='mr-2 h-4 w-4' /> },
  { name: 'dark', icon: <Moon className='mr-2 h-4 w-4' /> },
];

export default function UserMenu() {
  const { user } = useSession();
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <UserAvatar src={user.avatarUrl} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          Logged in as <span className='text-primary'>{user.username}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/users/${user.username}`}>
          <DropdownMenuItem>
            <User className='mr-2 h-4 w-4' />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className='mr-2 h-4 w-4' />
            <span>Themes</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {themes.map(({ name, icon }) => (
                <DropdownMenuItem key={name} onClick={() => setTheme(name)}>
                  {icon}
                  <span>{name[0].toUpperCase() + name.slice(1)}</span>
                  {theme === name && <Check className='ml-2 h-4 w-4' />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem
          onClick={() => {
            logout();
          }}
        >
          <LogOut className='mr-2 h-4 w-4' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
