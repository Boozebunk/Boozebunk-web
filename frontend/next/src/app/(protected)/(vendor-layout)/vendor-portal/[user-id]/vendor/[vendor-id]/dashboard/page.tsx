'use client';

import { useParams } from 'next/navigation';

import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import FrozenBanner from '~/components/vendor-dashboard/frozenBanner';
import { StockOverview } from '~/components/vendor-dashboard/stock-overview/StockOverview';
import { MostSearchedProducts } from '~/components/vendor-dashboard/top-stock/mostSearchedProducts';
import { StoreEngagement } from '~/components/vendor-dashboard/top-stock/storeEngagement';
import { trpcHttp } from '~/utils/trpc';

export default function Page() {
  const params = useParams();
  const userId = params['user-id'] as string;
  const vendorId = params['vendor-id'] as string;

  // fetching if vendor is frozen
  const { data: vendorActiveFroozen } = useQuery(trpcHttp.vendor.isVendorFrozen.queryOptions());

  // fetching vendor stock overviews
  const { data, isLoading } = useQuery(trpcHttp.analytics.getStockOverview.queryOptions());

  // fetching the specfic mart view and clicks by the customers
  const { data: martPop, isLoading: loadingMartPop } = useQuery(
    trpcHttp.analytics.getUserOverview.queryOptions()
  );

  const { mutateAsync: QuickAction } = useMutation(
    trpcHttp.analytics.vendorQuickActions.mutationOptions({
      onSuccess: () => {
        toast.success('Successfully Updated');
      },
      onError: (err) => {
        toast.error(err.message);
      }
    })
  );

  // fetching the top 5 popular brands searched
  const { data: popularBrands, isLoading: loadingPopBrands } = useQuery(
    trpcHttp.analytics.getPopularBrands.queryOptions()
  );

  // Fetch vendor quick actions
  const { data: quickActions } = useQuery(trpcHttp.analytics.getVendorQuickActions.queryOptions());

  return (
    <div>
      <div>{vendorActiveFroozen?.isFrozen && <FrozenBanner />}</div>
      <div className="flex flex-col gap-2 p-3 sm:gap-3 lg:px-10">
        <h1 className="text-lg font-medium md:text-2xl">
          <strong>Users</strong> Search Overview
        </h1>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-5">
          <MostSearchedProducts
            popularBrands={popularBrands?.result}
            isLoading={loadingPopBrands}
          />
          <StoreEngagement
            viewCount={martPop?.viewCount ?? 0}
            clickCount={martPop?.clickCount ?? 0}
            isLoading={loadingMartPop}
          />
        </div>
      </div>
      <StockOverview
        totalStockCount={data?.totalStockListed ?? 0}
        outOfStockItems={data?.outOfStockItems ?? []}
        isLoading={isLoading}
        outOfStockCount={data?.outOfStockCount ?? 0}
        userId={userId}
        vendorId={vendorId}
        initialQuickActions={quickActions?.settings}
        onQuickAction={async ({ martStatus, martOpenTime, martCloseTime }) => {
          await QuickAction({ martStatus, martOpenTime, martCloseTime });
        }}
      />
    </div>
  );
}
