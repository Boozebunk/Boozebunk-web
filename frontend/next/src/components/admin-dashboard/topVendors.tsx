import { Card } from '~/shared/shadcn/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/shared/shadcn/table';

const topMarts = [
  {
    martName: 'FreshMart',
    location: {
      area: 'Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra'
    },
    views: '12,500',
    trend: '+5.4%'
  },
  {
    martName: 'DailyNeeds',
    location: {
      area: 'Connaught Place',
      city: 'Delhi',
      state: 'Delhi'
    },
    views: '10,300',
    trend: '+3.1%'
  },
  {
    martName: 'GroceryHub',
    location: {
      area: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka'
    },
    views: '9,800',
    trend: '-1.2%'
  },
  {
    martName: 'EasyMart',
    location: {
      area: 'Banjara Hills',
      city: 'Hyderabad',
      state: 'Telangana'
    },
    views: '8,700',
    trend: '+4.6%'
  },
  {
    martName: 'QuickBuy',
    location: {
      area: 'T. Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu'
    },
    views: '7,400',
    trend: '+2.8%'
  }
];

export function TopVendors() {
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
              <TableHead className="text-right text-sm font-semibold md:text-xl">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topMarts.map((mart, idx) => (
              <TableRow key={idx}>
                <TableCell className="py-5 font-medium">{mart.martName}</TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm leading-tight">
                    <span>{mart.location.area}</span>
                    <span className="text-muted-foreground text-xs md:text-sm">
                      {mart.location.city}, {mart.location.state}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{mart.views}</TableCell>
                <TableCell className="text-right text-green-600">{mart.trend}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
