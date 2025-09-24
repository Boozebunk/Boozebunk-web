import { Loader2, LogIn, PackagePlus } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/shared/shadcn/card';

type VendorActivityProps = {
  newVendorsCount: number;
  newVendorsChange: number;
  loginFrequencyCount: number;
  loginFrequencyChange: number;
  isLoading: boolean;
};

export function VendorsActivity({
  loginFrequencyChange,
  loginFrequencyCount,
  newVendorsChange,
  newVendorsCount,
  isLoading
}: VendorActivityProps) {
  const cardData = [
    {
      title: 'New Vendors Registered',
      icon: PackagePlus,
      value: newVendorsCount,
      subtitle: 'In last 30 days',
      growth: `${newVendorsChange}% from previous month`
    },
    {
      title: 'Vendor Login Frequency',
      icon: LogIn,
      value: loginFrequencyChange,
      subtitle: 'Avg logins per week',
      growth: `${loginFrequencyCount}% from previous month`
    }
  ];

  return (
    <div className="flex flex-col gap-2 p-3 sm:gap-3 lg:px-10">
      <h1 className="text-lg font-medium md:text-2xl">
        <strong>Vendors</strong> Activity
      </h1>

      <div className="flex flex-row items-center justify-between gap-3">
        {cardData.map((data, idx) => {
          const Icon = data.icon;

          return (
            <Card
              key={idx}
              className="flex w-full items-center justify-center gap-5 p-3 sm:gap-10 lg:w-[calc(50%-1.25rem)]">
              <CardHeader className="w-full p-0 text-center">
                <CardTitle className="text-sm sm:text-xl">{data.title}</CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                <div className="flex items-start gap-2 sm:gap-5">
                  <Icon className="size-10 rounded-full bg-amber-100 p-2 text-amber-600 sm:size-12" />
                  <div className="flex flex-col items-start">
                    <span className="fill-foreground text-sm font-bold sm:text-2xl">
                      {isLoading ? <Loader2 /> : data.value}
                    </span>
                    <span className="text-muted-foreground text-[10px] sm:text-xs">
                      {data.subtitle}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-0">
                <p className="flex items-center text-center text-xs text-green-600 sm:text-sm">
                  ↑ {isLoading ? <Loader2 /> : data.growth}
                </p>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
