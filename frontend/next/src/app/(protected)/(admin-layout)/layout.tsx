import { cookies } from 'next/headers';

import { SidebarProvider } from '~/shared/shadcn/sidebar';

import { Navbar } from '~/components/admin-dashboard/navBar';
import { SideBar } from '~/components/admin-dashboard/sideBar';

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <SideBar />
      <main className="relative box-border w-full overflow-x-hidden scroll-smooth pb-10">
        <div className="admin-panel-bg pointer-events-none fixed bottom-0 left-0 z-0 h-[70%] w-full" />
        <div className="relative z-10">
          <Navbar />
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
