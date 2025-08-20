import Link from 'next/link';

import { Card, CardFooter } from '~/shared/shadcn/card';
import { Table, TableBody, TableCell, TableRow } from '~/shared/shadcn/table';

const lowStockItems = [
  { liquorName: "Jack Daniel's", size: '750ml' },
  { liquorName: 'Grey Goose', size: '1L' },
  { liquorName: 'Johnnie Walker Black', size: '750ml' },
  { liquorName: 'Bombay Sapphire', size: '1L' }
];

export function OutOfStock() {
  return (
    <Card className="p-5 lg:col-span-1">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold sm:text-xl">Out of Stock Items</h2>
        <span className="rounded-md bg-red-100 px-3 py-1 text-sm font-semibold text-red-600 sm:text-xl">
          {lowStockItems.length} Items
        </span>
      </div>

      <Table>
        <TableBody>
          {lowStockItems.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm sm:font-medium">{item.liquorName}</span>
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

      <CardFooter className="justify-center">
        <Link
          href="/vendor-portal/0999/vendor/outofstock-items"
          className="text-primary font-medium hover:underline active:underline">
          View all out of stock items
        </Link>
      </CardFooter>
    </Card>
  );
}
