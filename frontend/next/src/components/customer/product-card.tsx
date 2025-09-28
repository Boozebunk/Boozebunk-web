import { ArrowUpRight } from 'lucide-react';

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
      <CardContent>
        <div className="flex items-center gap-3">
          {/* <img
            src="https://www.livcheers.com/static/content/images/liquor/LCIN03591.webp"
            width={120}
            height={100}
          /> */}
          {/* <ProductImage productName={info.name} /> */}
          <div className="flex flex-col gap-2">
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

              <div className="flex items-center gap-4">
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
              <div className="flex w-full items-center gap-1.5 text-sm sm:text-base">
                <span>At:</span>

                <Button
                  onClick={handleLocate}
                  variant="link"
                  className="flex items-center gap-1 !p-0 text-sm text-amber-600 hover:text-blue-700 sm:text-base">
                  {info.martName}
                  <ArrowUpRight className="h-5 w-5 flex-shrink-0" strokeWidth={1.75} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
