'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CircleUserRound, Loader2, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

import { Button } from '~/shared/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/shared/shadcn/dropdown-menu';
import { SidebarTrigger } from '~/shared/shadcn/sidebar';

import { trpcHttp } from '~/utils/trpc';

import Logo2 from '../../../public/Assets/Logo-main-2.png';
import Logo from '../../../public/Assets/Logo-main.png';
import { Greeting } from '../greeting';

export function Navbar() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync: logout, isPending } = useMutation(
    trpcHttp.auth.logout.mutationOptions({
      onSuccess: async () => {
        console.log('Logged out successfully');
        toast.success('Logged out Successfully');
        // 1. Invalidate the old session data to mark it as stale
        await queryClient.invalidateQueries({
          queryKey: trpcHttp.auth.getSession.queryOptions().queryKey
        });

        // 2. Force a re-fetch of the session data, which should now return null
        await queryClient.fetchQuery(trpcHttp.auth.getSession.queryOptions());
        router.push('/vendor-authentication/sign-in');
      },
      onError: (err) => {
        toast.error(err.message);
        console.error('Error while logging out:', err);
      }
    })
  );

  const handleLogout = async () => {
    await logout();
    console.log('Logging out...');
  };

  return (
    <nav className="bg-sidebar border-sidebar-border sticky top-0 box-border flex items-center justify-between border-b p-3">
      <div className="flex items-center gap-3 lg:gap-5">
        <SidebarTrigger className="p-5" />
        {/* <div className="flex items-center gap-1">
          <span className="hidden sm:block">Store:</span>
          <Badge
            className={`uppercase ${
              status === 'open' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
            {status}
          </Badge>
        </div> */}
      </div>

      <div className="absolute left-1/2 hidden w-fit -translate-x-1/2 transform p-3 py-5 sm:p-5 md:block">
        <Greeting name="Partner" />
      </div>

      <Button
        asChild
        className="absolute left-1/2 block w-fit -translate-x-1/2 transform bg-[#fff5cb] p-3 py-5 hover:bg-[#fff5cb] active:bg-[#fff5cb] sm:p-5 md:hidden">
        <Link href="/" className="flex items-center justify-baseline text-2xl">
          <Image src={Logo} alt="logo" className="w-6" />
          <Image src={Logo2} alt="logo" className="ml-[-5px] hidden w-35 sm:block" />
        </Link>
      </Button>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <CircleUserRound className="size-8" strokeWidth={1.75} />
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10} className="mr-2">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut /> {isPending ? <Loader2 /> : 'Logout'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
