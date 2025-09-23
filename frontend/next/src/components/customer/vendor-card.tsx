import Link from 'next/link';

import clsx from 'clsx';
import { ArrowUpRight, Check, MapPin, Store, X } from 'lucide-react';

import { Badge } from '~/shared/shadcn/badge';
import { Card, CardContent } from '~/shared/shadcn/card';

type VendorCardProps = {
  name: string;
  distance: string;
  storeStatus: string | undefined;
};

export const VendorCard = ({ info }: { info: VendorCardProps }) => {
  return (
    <Card className="p-5 md:p-7">
      <CardContent className="w-fit min-w-[150px] p-0 md:min-w-[250px]">
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-1.5">
            <Store className="!size-8 rounded-full bg-amber-100 p-1 text-amber-600" />
            <span className="truncate text-sm leading-5 font-semibold md:max-w-[350px] lg:text-lg">
              {info.name}
            </span>
          </div>

          <div className="ml-1 flex items-center gap-1">
            <Badge
              className={clsx(
                'flex items-center justify-center rounded-full p-1 text-white',
                info.storeStatus === 'Close' ? 'bg-red-600' : 'bg-green-600'
              )}>
              {info.storeStatus === 'Close' ? (
                <X strokeWidth={3} className="size-4" />
              ) : (
                <Check strokeWidth={3} className="size-4" />
              )}
            </Badge>

            <span
              className={clsx(
                'text-sm md:text-base',
                info.storeStatus === 'Close' ? 'text-red-600' : 'text-green-600'
              )}>
              {' '}
              {info.storeStatus}
            </span>
          </div>

          <div className="ml-1 flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm text-[#6B0F1A] lg:text-lg dark:text-[#ffc82e]">
              <MapPin className="h-4 w-4" />
              {info.distance}
            </span>
            <span className="bg-foreground h-[15] w-[1px]"></span>
            <Link
              href={''}
              className="flex items-center text-sm text-blue-600 hover:text-blue-700 lg:text-lg">
              locate <ArrowUpRight className="h-5 w-5" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
