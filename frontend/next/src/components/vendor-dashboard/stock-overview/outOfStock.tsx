import Link from 'next/link';

import { Loader2 } from 'lucide-react';

import { Card, CardFooter } from '~/shared/shadcn/card';
import { Table, TableBody, TableCell, TableRow } from '~/shared/shadcn/table';

type OutOfStockProps = {
  outOfStockItems: { brandName: string; productName: string; size: string }[];
  userId: string;
  vendorId: string;
  isLoadingStock: boolean;
  outOfStockCount: number;
};

export function OutOfStock({
  outOfStockItems,
  userId,
  vendorId,
  isLoadingStock,
  outOfStockCount
}: OutOfStockProps) {
  return (
    <Card className="p-5 lg:col-span-1">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold sm:text-xl">Out of Stock Items</h2>
        <span className="rounded-md bg-red-100 px-3 py-1 text-sm font-semibold text-red-600 sm:text-xl">
          {isLoadingStock ? <Loader2 /> : outOfStockCount} Items
        </span>
      </div>

      {outOfStockCount == 0 ? (
        <span>No Out of Stock Items</span>
      ) : isLoadingStock ? (
        <Loader2 />
      ) : (
        <Table>
          <TableBody>
            {outOfStockItems.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm sm:font-medium">
                      {item.brandName} - {item.productName}
                    </span>
                    <span className="text-muted-foreground text-xs md:text-sm">{item.size}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm font-semibold text-red-600">Out of stock</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <CardFooter className="justify-center">
        <Link
          href={`/vendor-portal/${userId}/vendor/${vendorId}/stock-list`}
          className="text-primary font-medium hover:underline active:underline">
          View all out of stock items
        </Link>
      </CardFooter>
    </Card>
  );
}
