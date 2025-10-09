'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import {
  ClipboardList,
  Home,
  MessageSquareText,
  PackagePlus,
  PencilLine,
  Speech,
  Store
} from 'lucide-react';

import { Button } from '~/shared/shadcn/button';
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
import { CustomDialog } from '~/shared/components/dialogBox';

import { trpcHttp } from '~/utils/trpc';

import Logo2 from '../../../public/Assets/Logo-main-2.png';
import Logo from '../../../public/Assets/Logo-main.png';

import { WriteBlog } from './blogWriting';
import { AddPromotionsBanner } from './promotions-banner';

interface SessionTypes {
  id: string;
  roleId: string;
  email: string;
  role: 'admin' | 'vendor';
}

export function SideBar() {
  const { data: session } = useQuery(trpcHttp.auth.getSession.queryOptions<SessionTypes>());

  const items = [
    {
      title: 'Dashboard',
      url: `/admin-portal/${session?.id}/admin/${session?.roleId}/dashboard`,
      icon: Home
    },
    {
      title: 'Feedbacks',
      url: `/admin-portal/${session?.id}/admin/${session?.roleId}/feedbacks`,
      icon: MessageSquareText
    }
  ];

  const [openQuery, setOpenQuery] = useState<boolean>(false);
  const handleQueryCreate = async (title: string, description: string) => {
    console.log(title, description);
    setOpenQuery(false);
  };

  const [openAddPromotionsBanner, setOpenAddPromotionsBanner] = useState<boolean>(false);

  return (
    <>
      <AddPromotionsBanner
        open={openAddPromotionsBanner}
        onOpenChange={setOpenAddPromotionsBanner}
      />
      <CustomDialog open={openQuery} onOpenChange={setOpenQuery}>
        {<WriteBlog onQuerySubmit={handleQueryCreate} isLoading={false} />}
      </CustomDialog>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center justify-center">
              <SidebarMenuButton
                asChild
                className="w-fit bg-[#fff5cb] p-5 py-5 hover:bg-[#fff5cb] active:bg-[#fff5cb]">
                <Link
                  href={`/admin-portal/${session?.id}/admin/${session?.roleId}/dashboard`}
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
              <SidebarMenu className="gap-4">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="p-5 py-6">
                      <Link href={item.url}>
                        <item.icon className="mr-2 !size-6" />
                        <span className="text-[17px] font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="p-5 py-6">
                    <Button
                      className="flex items-center justify-start gap-2 border-none !px-5 shadow-none"
                      variant={'outline'}
                      onClick={() => setOpenQuery(true)}>
                      <PencilLine className="mr-2 !size-6" />
                      <span className="text-[17px] font-medium">Write Blog</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="p-5 py-6">
                    <Button
                      className="flex items-center justify-start gap-2 border-none !px-5 shadow-none"
                      variant={'outline'}
                      onClick={() => setOpenAddPromotionsBanner(true)}>
                      <Speech className="mr-2 !size-6" />
                      <span className="text-[17px] font-medium">Add Promotion</span>
                    </Button>
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
                    <Link
                      href={`/admin-portal/${session?.id}/admin/${session?.roleId}/vendors-list`}>
                      <Store className="mr-2 !size-6" />
                      <span className="text-[17px] font-medium">Vendors</span>
                    </Link>
                  </SidebarMenuButton>

                  <SidebarMenuSub className="ml-7 gap-2">
                    <SidebarMenuSubItem>
                      <SidebarMenuButton asChild className="py-5">
                        <Link
                          href={`/admin-portal/${session?.id}/admin/${session?.roleId}/vendor-registration`}>
                          <PackagePlus className="mr-2 !size-5" />
                          <span className="text-[15px] font-medium">Register Vendor</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>

                    <SidebarMenuSubItem>
                      <SidebarMenuButton asChild className="py-5">
                        <Link
                          href={`/admin-portal/${session?.id}/admin/${session?.roleId}/vendor-queries`}>
                          <ClipboardList className="mr-2 !size-5" />
                          <span className="text-[15px] font-medium">Vendor Queries</span>
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
    </>
  );
}
