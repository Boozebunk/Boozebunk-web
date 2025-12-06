'use client';

import { useQuery } from '@tanstack/react-query';

// import { Analytics } from '~/components/admin-dashboard/analytics';
import { TopVendors } from '~/components/admin-dashboard/topVendors';
import { VendorsActivity } from '~/components/admin-dashboard/vendorsActivity';
import { trpcHttp } from '~/utils/trpc';

export default function Page() {
  const { data, isLoading: isLoadingVendorAnalytics } = useQuery(
    trpcHttp.analytics.getVendorActivity.queryOptions()
  );

  const { data: popMarts, isLoading: loadingPopMarts } = useQuery(
    trpcHttp.analytics.getPopularMarts.queryOptions()
  );

  return (
    <div>
      {/* <Analytics /> */}
      <VendorsActivity
        loginFrequencyChange={data?.loginFrequency.change ?? 0}
        loginFrequencyCount={data?.loginFrequency.avgLoginsPerWeek ?? 0}
        newVendorsChange={data?.newVendors.change ?? 0}
        newVendorsCount={data?.newVendors.count ?? 0}
        isLoading={isLoadingVendorAnalytics}
      />
      <TopVendors popMarts={popMarts?.popularMarts ?? []} isLoading={loadingPopMarts} />
    </div>
  );
}
