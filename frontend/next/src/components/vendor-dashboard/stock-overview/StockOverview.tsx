import { useRouter } from 'next/navigation';

import { ChevronRight, PackagePlus } from 'lucide-react';

import { Button } from '~/shared/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/shadcn/card';

import { StoreStatus } from '../quick-actions/storeStatus';

import { OutOfStock } from './outOfStock';
import { TotalStock } from './totalStock';

type StockOverviewProps = {
  totalStockCount: number;
  outOfStockItems: { brandName: string; productName: string; size: string }[];
  isLoading: boolean;
  userId: string;
  vendorId: string;
  outOfStockCount: number;
  onQuickAction?: (params: {
    martStatus: 'OPEN' | 'CLOSED';
    martOpenTime: string;
    martCloseTime: string;
  }) => void;
};

export function StockOverview({
  totalStockCount,
  outOfStockItems,
  isLoading,
  userId,
  vendorId,
  outOfStockCount,
  onQuickAction
}: StockOverviewProps) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2 p-3 sm:gap-3 lg:px-10">
      <h1 className="text-lg font-medium md:text-2xl">
        <strong>Stock</strong> Overview
      </h1>

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-[3fr_5fr] lg:grid-cols-[1fr_2fr_2fr]">
        {' '}
        <TotalStock
          totalStockListed={totalStockCount}
          userId={userId}
          vendorId={vendorId}
          isLoadingCount={isLoading}
        />
        <OutOfStock
          outOfStockItems={outOfStockItems}
          userId={userId}
          vendorId={vendorId}
          isLoadingStock={isLoading}
          outOfStockCount={outOfStockCount}
        />
        <Card className="flex w-full items-center gap-5 p-5 px-5 sm:gap-10 md:col-span-2 lg:col-span-1">
          <CardHeader className="w-full p-0 text-center">
            <CardTitle className="text-sm sm:text-xl">Quick Actions</CardTitle>
          </CardHeader>

          <CardContent className="flex w-full flex-col gap-5 p-0">
            <StoreStatus onQuickAction={onQuickAction} />
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <Button
                onClick={() => {
                  router.push(`/vendor-portal/${userId}/vendor/${vendorId}/add-product`);
                }}
                className="flex flex-1 items-center gap-2">
                Add new product <PackagePlus /> <ChevronRight />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
