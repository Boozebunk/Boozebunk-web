import { Activity, Ban, Store } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '~/shared/shadcn/card';

const cardData = [
  {
    title: 'Total Vendors',
    icon: Store,
    value: '1,200',
    subtitle: 'In last 30 days',
    growth: '5% from previous month'
  },
  {
    title: 'Active Vendors',
    icon: Activity,
    value: '1,200',
    subtitle: 'Avg logins per week',
    growth: '25% from previous month'
  },
  {
    title: 'Frozen Vendors',
    icon: Ban,
    value: '1,200',
    subtitle: 'Avg logins per week',
    growth: '25% from previous month'
  }
];

export function VendorsOverview() {
  return (
    <div className="flex flex-col gap-2 p-3 sm:gap-3 lg:px-10">
      <h1 className="font-medium md:text-2xl">
        <strong>Vendors</strong> Overview
      </h1>

      <div className="flex flex-row items-center justify-between gap-3">
        {cardData.map((data, idx) => {
          const Icon = data.icon;

          return (
            <Card
              key={idx}
              className="flex w-full gap-5 p-3 sm:gap-2 sm:p-5 lg:w-[calc(50%-1.25rem)]">
              <CardHeader className="w-full flex-row p-0 text-left">
                <CardTitle className="flex flex-row justify-between gap-0 text-sm sm:text-xl">
                  {data.title}
                  <Icon className="size-10 overflow-hidden rounded-full bg-amber-100 p-2 text-amber-600 sm:size-12" />
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <span className="fill-foreground text-sm font-bold sm:text-2xl">
                    {data.value}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
