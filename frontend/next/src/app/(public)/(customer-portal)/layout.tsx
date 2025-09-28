'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import { pageview } from '~/lib/analytics';
import { Button } from '~/shared/shadcn/button';
import { CustomDialog } from '~/shared/components/dialogBox';

import AgeVerificationDialog from '~/components/customer/age-verification';
import { WriteFeedback } from '~/components/customer/feedback';
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
  const [openFeedback, setFeedback] = useState<boolean>(false);

  return (
    <CustomerProvider>
      <>
        <div className="fixed top-1/2 left-0 z-50 -translate-y-1/2">
          <Button
            onClick={() => setFeedback(true)}
            className="animate-slide-in-left sm:text-md origin-bottom-left rotate-90 cursor-pointer rounded-none text-sm font-medium shadow-lg transition-colors lg:text-lg"
            aria-label="Open feedback">
            Feedback
          </Button>
        </div>
        <CustomDialog open={openFeedback} onOpenChange={setFeedback}>
          {<WriteFeedback />}
        </CustomDialog>
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
