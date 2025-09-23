'use client';

import { useParams } from 'next/navigation';

import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { StockOverview } from '~/components/vendor-dashboard/stock-overview/StockOverview';
import { TopStock } from '~/components/vendor-dashboard/top-stock/topStockOverview';
import { trpcHttp } from '~/utils/trpc';

export default function Page() {
  const params = useParams();
  const userId = params['user-id'] as string;
  const vendorId = params['vendor-id'] as string;

  const { data, isLoading } = useQuery(trpcHttp.analytics.getStockOverview.queryOptions());

  const { mutateAsync: QuickAction } = useMutation(
    trpcHttp.analytics.vendorQuickActions.mutationOptions({
      onSuccess: () => {
        toast.success('Successfully Updated');
      },
      onError: (err) => {
        toast.error('Error Updating');
        console.log('Error Updating QuickActions ', err.message);
      }
    })
  );

  return (
    <div>
      <TopStock />
      <StockOverview
        totalStockCount={data?.totalStockListed ?? 0}
        outOfStockItems={data?.outOfStockItems ?? []}
        isLoading={isLoading}
        outOfStockCount={data?.outOfStockCount ?? 0}
        userId={userId}
        vendorId={vendorId}
        onQuickAction={async ({ martStatus, martOpenTime, martCloseTime }) => {
          await QuickAction({ martStatus, martOpenTime, martCloseTime });
        }}
      />
    </div>
  );
}
