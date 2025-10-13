import { ImageOff } from 'lucide-react';

import { Badge } from '~/shared/shadcn/badge';
import { Card, CardContent } from '~/shared/shadcn/card';

type ProductCardProps = {
  martName?: string | null;
  productName: string;
  brandName: string;
  category: string;
  type: string | null;
  price: string;
  size: string;
  productImageUrl: string | null;
  martLat?: number;
  martLng?: number;
  showLocate?: boolean;
};

export const ProductCard = ({ info }: { info: ProductCardProps }) => {
  const handleLocate = () => {
    const lat = info.martLat;
    const lng = info.martLng;
    if (lat && lng) {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      window.open(googleMapsUrl, '_blank');
    } else {
      console.warn('Coordinates missing for mart:', info.martName);
    }
  };
  return (
    <Card className="md:max-w-[500px]">
      <CardContent>
        <div className="flex items-center gap-3 sm:flex-col md:flex-row">
          <div className="relative h-40 w-30 shrink-0 sm:h-50 sm:w-35">
            {!info.productImageUrl ? (
              <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-100">
                <ImageOff />
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={info.productImageUrl}
                alt={info.productName}
                className="h-full w-full object-contain"
              />
            )}
          </div>
          <div className="flex w-full flex-col gap-2">
            <Badge className="rounded-md bg-[#fff5cb] px-2 py-1 text-sm font-medium text-[#8B5E3C] sm:text-base">
              {info.category}
            </Badge>
            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-0">
                <span className="text-xs font-medium text-[#1e69af] sm:text-sm">
                  {info.brandName}
                </span>
                <span className="h-[2.5rem] text-sm leading-5 font-semibold sm:text-base">
                  {info.productName}
                </span>
              </div>

              <div className="flex items-center gap-4 sm:gap-2 md:gap-4">
                <span className="text-sm font-semibold sm:text-base">₹{info.price}</span>
                <span className="bg-foreground h-4 w-[1.5px]"></span>
                <span className="text-sm font-medium text-[#1E40AF] sm:text-base dark:text-[#DBEAFE]">
                  {info.size}
                </span>
              </div>
            </div>
            <span className="text-sm text-[#6B0F1A] sm:text-base dark:text-[#ffc82e]">
              {info.type}
            </span>
            {info.martName && (
              <div className="flex flex-wrap items-center gap-0 text-sm sm:text-base">
                <span className="mr-1.5 font-medium">At:</span>

                <span
                  onClick={handleLocate}
                  className="flex cursor-pointer items-center font-semibold text-amber-600 transition-colors duration-200 hover:text-blue-700 hover:underline">
                  {info.martName} ↗
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
