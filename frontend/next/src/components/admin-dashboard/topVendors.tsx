import { Card } from '~/shared/shadcn/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/shared/shadcn/table';
import { ComponentLoader } from '~/shared/components/componentLoader';

type PopularMarts = {
  martName: string;
  martCity: string | null;
  martState: string | null;
  viewCount: number;
  clickCount: number;
}[];

export function TopVendors({
  popMarts,
  isLoading
}: {
  popMarts: PopularMarts;
  isLoading: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 p-3 sm:gap-3 lg:px-10">
      <h1 className="text-lg font-medium md:text-2xl">
        <strong>Top 5</strong> Most Viewed Marts
      </h1>

      <Card className="p-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-sm font-semibold md:text-xl">Mart Name</TableHead>
              <TableHead className="text-sm font-semibold md:text-xl">Location</TableHead>
              <TableHead className="text-sm font-semibold md:text-xl">Views</TableHead>
              <TableHead className="text-right text-sm font-semibold md:text-xl">clicks</TableHead>
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <ComponentLoader />
          ) : (
            <TableBody>
              {popMarts.map((mart, idx) => (
                <TableRow key={idx}>
                  <TableCell className="py-5 font-medium">{mart.martName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm leading-tight">
                      <span className="text-muted-foreground text-xs md:text-sm">
                        {mart.martCity}, {mart.martState}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{mart.viewCount}</TableCell>
                  <TableCell className="text-right text-green-600">{mart.clickCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </Card>
    </div>
  );
}
