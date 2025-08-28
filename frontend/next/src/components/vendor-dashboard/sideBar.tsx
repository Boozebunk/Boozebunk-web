'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import { Boxes, Home, PackagePlus } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem
} from '~/shared/shadcn/sidebar';

import { trpcHttp } from '~/utils/trpc';

import Logo2 from '../../../public/Assets/Logo-main-2.png';
import Logo from '../../../public/Assets/Logo-main.png';

interface SessionTypes {
  id: string;
  email: string;
  role: 'admin' | 'vendor';
}

export function SideBar() {
  const { data: session } = useQuery(trpcHttp.auth.getSession.queryOptions<SessionTypes>());
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-center">
            <SidebarMenuButton
              asChild
              className="w-fit bg-[#fff5cb] p-5 py-5 hover:bg-[#fff5cb] active:bg-[#fff5cb]">
              <Link
                href={`/vendor-portal/${session?.id}/vendor/dashboard`}
                className="flex items-center justify-baseline text-2xl">
                <Image src={Logo} alt="logo" className="w-6" />
                <Image src={Logo2} alt="logo" className="ml-[-5px] w-35" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <div className="bg-sidebar-border h-[1px] w-[80%] self-center" />

      <SidebarContent className="mt-3 gap-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="p-5 py-6">
                  <Link href={`/vendor-portal/${session?.id}/vendor/dashboard`}>
                    <Home className="mr-2 !size-6" />
                    <span className="text-[17px] font-medium">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="bg-sidebar-border h-[1px] w-[80%] self-center" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="mb-2 p-5 py-6">
                  <Link href={`/vendor-portal/${session?.id}/vendor/stock-list`}>
                    <Boxes className="mr-2 !size-6" />
                    <span className="text-[17px] font-medium">Stock</span>
                  </Link>
                </SidebarMenuButton>

                <SidebarMenuSub className="ml-7 gap-2">
                  <SidebarMenuSubItem>
                    <SidebarMenuButton asChild className="py-5">
                      <Link href={`/vendor-portal/${session?.id}/vendor/add-product`}>
                        <PackagePlus className="mr-2 !size-5" />
                        <span className="text-[15px] font-medium">New Product</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
