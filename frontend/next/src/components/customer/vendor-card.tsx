import clsx from 'clsx';
import { ArrowUpRight, Check, Clock, MapPin, Store, X } from 'lucide-react';

import { Badge } from '~/shared/shadcn/badge';
import { Button } from '~/shared/shadcn/button';
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
      <CardContent className="w-fit min-w-[150px] p-0 md:min-w-[250px]">
        <div className="flex flex-col items-start gap-3">
          {/* Store name section */}
          <div className="flex items-center gap-1.5">
            <Store className="!size-8 rounded-full bg-amber-100 p-1 text-amber-600" />
            <span className="truncate text-sm leading-5 font-semibold md:max-w-[350px] lg:text-lg">
              {info.name}
            </span>
          </div>

          {/* Store status section */}
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
              {info.storeStatus}
            </span>
          </div>

          {/* Address section */}
          <div className="ml-1 flex flex-col gap-2">
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              {info.area}, {info.city}, {info.state} - {info.postalCode}
            </span>

            {/* Timing section */}
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              {info.openTime} - {info.closeTime}
            </span>

            {/* Distance and locate section */}
            <div className="flex items-center gap-3">
              <span>{info.distance} km</span>
              <span className="bg-foreground h-[15px] w-[1px]"></span>
              <Button
                onClick={handleLocate}
                className="flex items-center bg-none text-sm text-blue-600 hover:text-blue-700 lg:text-base"
                variant="link">
                locate <ArrowUpRight className="h-5 w-5" strokeWidth={1.75} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
