import { cookies } from 'next/headers';

import { api } from '@boozebunk-trpc/utils/server-api';

import { SidebarProvider } from '~/shared/shadcn/sidebar';

import DeletedBanner from '~/components/vendor-dashboard/deletedBanner';
import { Navbar } from '~/components/vendor-dashboard/navBar';
import { SideBar } from '~/components/vendor-dashboard/sideBar';

export default async function VendorLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  let isVendorDeleted = false;

  try {
    // 1. Fetch vendor status using a server-side API call
    const statusData = await api.vendor.isVendorDeleted.query();
    isVendorDeleted = statusData.isDeleted;
    console.log('Checking for vendor deletion :- ', isVendorDeleted);
  } catch (error) {
    console.error('Failed to fetch vendor status in layout:', error);
    isVendorDeleted = true;
  }

  if (isVendorDeleted) {
    return <DeletedBanner />;
  }

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <SideBar />
      <div className="relative box-border min-h-screen w-full overflow-x-hidden">
        <div className="panel-bg pointer-events-none fixed bottom-0 left-0 z-0 h-[70%] w-full" />
        <Navbar />
        <main className="mb-20 box-border">
          <div className="relative z-10">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
