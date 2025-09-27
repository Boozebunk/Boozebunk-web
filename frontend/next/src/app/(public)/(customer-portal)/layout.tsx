'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import { pageview } from '~/lib/analytics';

import AgeVerificationDialog from '~/components/customer/age-verification';
import CustomerFooter from '~/components/customer/footer';
import { Header } from '~/components/customer/header';
import { CustomerProvider } from '~/providers/customer-provider';
import { trpcHttp } from '~/utils/trpc';

export function AnalyticsListener() {
  const pathname = usePathname();

  useEffect(() => {
    pageview(window.location.pathname);
  }, [pathname]);

  return null;
}

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { data: citiesData, isLoading } = useQuery(trpcHttp.customer.getCities.queryOptions());

  return (
    <CustomerProvider>
      <>
        <AgeVerificationDialog />
        <div className="relative flex flex-col items-center gap-8 md:gap-10">
          <Header cities={citiesData?.cities ?? []} isLoadingCities={isLoading} />
          <main className="flex w-full">{children}</main>
          <CustomerFooter />
        </div>
        <AnalyticsListener />
      </>
    </CustomerProvider>
  );
}
