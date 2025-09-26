// import Image from 'next/image';

import { Badge } from '~/shared/shadcn/badge';
import { Button } from '~/shared/shadcn/button';
import { Card, CardContent } from '~/shared/shadcn/card';

type ProductCardProps = {
  martName: string | null;
  martStatus: string | null;
  productName: string;
  brandName: string;
  category: string;
  type: string | null;
  price: string;
  size: string;
  martLat: number;
  martLng: number;
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
    <Card>
      <CardContent className="w-[400px]">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-2">
            <Badge className="rounded-md bg-[#fff5cb] px-2 py-1 text-sm font-medium text-[#8B5E3C] sm:text-base">
              {info.category}
            </Badge>
            <div className="flex flex-col gap-1">
              <span className="h-[2.5rem] text-sm leading-5 font-semibold sm:text-base">
                {info.productName} - {info.brandName}
              </span>
              <span className="text-sm text-[#1E40AF] sm:text-base dark:text-[#DBEAFE]">
                {info.size}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold sm:text-base">₹{info.price}</span>
                <span className="bg-foreground h-5 w-[1.5px]"></span>
                <Badge
                  className={`rounded-md ${info.martStatus === 'OPEN' ? 'bg-green-600' : 'bg-red-600'} text-sm font-medium text-white sm:text-base`}>
                  {info.martStatus}
                </Badge>
              </div>
            </div>
            <span className="text-sm text-[#6B0F1A] sm:text-base dark:text-[#ffc82e]">
              {info.type}
            </span>
            {info.martName && (
              <span className="text-sm text-gray-500">Available at: {info.martName}</span>
            )}
          </div>
          <div>
            <Button
              onClick={handleLocate}
              className='className="mt-4 hover:bg-blue-700" bg-blue-600'>
              Locate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
