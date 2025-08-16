import Link from 'next/link';

import { Card, CardFooter } from '~/shared/shadcn/card';
import { Table, TableBody, TableCell, TableRow } from '~/shared/shadcn/table';

const lowStockItems = [
  { liquorName: "Jack Daniel's", size: '750ml', stockLeft: 2 },
  { liquorName: 'Grey Goose', size: '1L', stockLeft: 3 },
  { liquorName: 'Johnnie Walker Black', size: '750ml', stockLeft: 2 },
  { liquorName: 'Bombay Sapphire', size: '1L', stockLeft: 4 }
];

export function LowStock() {
  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold sm:text-xl">Low Stock Alerts</h2>
        <span className="text-sm font-semibold sm:text-xl">{lowStockItems.length} Items</span>
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
                <span className="text-sm font-semibold">Only {item.stockLeft} left</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CardFooter className="justify-center">
        <Link href="#" className="text-primary font-medium hover:underline active:underline">
          View all low stock items
        </Link>
      </CardFooter>
    </Card>
  );
}
