import Link from 'next/link';

import { BottleWine, Loader2 } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/shared/shadcn/card';

export function TotalStock({
  totalStockListed,
  userId,
  vendorId,
  isLoadingCount
}: {
  totalStockListed: number;
  userId: string;
  vendorId: string;
  isLoadingCount: boolean;
}) {
  return (
    <Card className="flex w-full items-center justify-center gap-5 p-3 sm:gap-10">
      <CardHeader className="w-full p-0 text-center">
        <CardTitle className="text-sm sm:text-xl">Total Stock Listed</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex items-start gap-2 sm:gap-5">
          <BottleWine className="size-10 shrink-0 rounded-full bg-amber-100 p-2 text-amber-600 sm:size-12" />
          <div className="flex flex-col items-start">
            <span className="fill-foreground text-sm font-bold sm:text-2xl">
              {isLoadingCount ? <Loader2 /> : totalStockListed}
            </span>
            <span className="text-muted-foreground text-[10px] sm:text-xs">No of bottles.</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-1 p-0 text-sm sm:text-xl">
        <Link
          href={`/vendor-portal/${userId}/vendor/${vendorId}/stock-list`}
          className="font-semibold hover:underline active:underline">
          View all
        </Link>
      </CardFooter>
    </Card>
  );
}
