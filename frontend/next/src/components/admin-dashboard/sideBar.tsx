import Image from 'next/image';
import Link from 'next/link';

import { Boxes, Home, MessageSquareText, PackagePlus, Store } from 'lucide-react';

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

import Logo2 from '../../../public/Assets/Logo-main-2.png';
import Logo from '../../../public/Assets/Logo-main.png';

const items = [
  {
    title: 'Dashboard',
    url: '#',
    icon: Home
  },
  {
    title: 'Feedbacks',
    url: '#',
    icon: MessageSquareText
  }
];

export function SideBar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-center">
            <SidebarMenuButton
              asChild
              className="w-fit bg-[#fff5cb] p-5 py-5 hover:bg-[#fff5cb] active:bg-[#fff5cb]">
              <Link href="/" className="flex items-center justify-baseline text-2xl">
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="bg-sidebar-border h-[1px] w-[80%] self-center" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="mb-2 p-5 py-6">
                  <Link href="#">
                    <Store className="mr-2 !size-6" />
                    <span className="text-[17px] font-medium">Vendors</span>
                  </Link>
                </SidebarMenuButton>

                <SidebarMenuSub className="ml-7 gap-2">
                  <SidebarMenuSubItem>
                    <SidebarMenuButton asChild className="py-5">
                      <Link href="#">
                        <PackagePlus className="mr-2 !size-5" />
                        <span className="text-[15px] font-medium">Register Vendor</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuButton asChild className="py-5">
                      <Link href="#">
                        <Boxes className="mr-2 !size-5" />
                        <span className="text-[15px] font-medium">Inventory</span>
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
