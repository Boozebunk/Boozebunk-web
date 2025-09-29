import clsx from 'clsx';
import { Check, Clock, MapPin, Store, X } from 'lucide-react';

import { Badge } from '~/shared/shadcn/badge';
import { Card, CardContent } from '~/shared/shadcn/card';

type VendorCardProps = {
  id: string;
  name: string;
  distance: string;
  storeStatus: string;
  martLat: number;
  martLng: number;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  openTime: string;
  closeTime: string;
};

export const VendorCard = ({ info }: { info: VendorCardProps }) => {
  const handleLocate = () => {
    const lat = info.martLat;
    const lng = info.martLng;
    if (lat && lng) {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      window.open(googleMapsUrl, '_blank');
    } else {
      console.warn('Coordinates missing for mart:', info.name);
    }
  };
  return (
    <Card className="p-5 md:p-7">
      <CardContent className="w-fit max-w-[300px] min-w-[150px] p-0 md:max-w-[400px] md:min-w-[250px] lg:max-w-[500px]">
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
                'flex items-center justify-center rounded-full text-white md:px-2 md:py-1',
                info.storeStatus === 'CLOSED' ? 'bg-red-600' : 'bg-green-600'
              )}>
              {info.storeStatus === 'ClOSED' ? (
                <X strokeWidth={3} className="size-4 shrink-0" />
              ) : (
                <Check strokeWidth={3} className="size-4 shrink-0" />
              )}
            </Badge>

            <span
              className={clsx(
                'text-sm font-medium md:text-base',
                info.storeStatus === 'CLOSED' ? 'text-red-600' : 'text-green-600'
              )}>
              {' '}
              {info.storeStatus}
            </span>
          </div>

          <div className="ml-1 flex flex-col gap-2">
            <div className="flex h-[2.5rem] flex-wrap items-center text-sm">
              <span className="flex items-center gap-1 truncate text-sm">
                <MapPin className="h-4 w-4 shrink-0 text-amber-600" />
                <span className="max-w-[250px] truncate">{info.area}</span>
                <span>,</span>
              </span>
              <span className="ml-1 whitespace-nowrap">
                {' '}
                {info.city}, {info.state} - {info.postalCode}
              </span>
            </div>

            {/* Timing section */}
            <span className="text-muted-foreground flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4" />
              {info.openTime} - {info.closeTime}
            </span>
          </div>

          <div className="ml-1 flex items-center gap-4">
            <span className="flex items-center gap-1 text-sm text-[#6B0F1A] lg:text-lg dark:text-[#ffc82e]">
              {info.distance} km
            </span>
            <span className="bg-foreground h-[15] w-[1px]"></span>
            <span
              onClick={handleLocate}
              className="flex cursor-pointer items-center bg-none text-sm text-blue-600 hover:text-blue-700 hover:underline lg:text-lg">
              locate ↗
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
