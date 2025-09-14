// import Image from 'next/image';

import { Badge } from '~/shared/shadcn/badge';
import { Card, CardContent } from '~/shared/shadcn/card';

type ProductCardProps = {
  image: string;
  category: string;
  name: string;
  size: string;
  price: string | number;
  type: string;
};

export const ProductCard = ({ info }: { info: ProductCardProps }) => {
  return (
    <Card>
      <CardContent className="w-[400px]">
        <div className="flex items-center gap-3">
          {/* <img src={info.image} alt={info.name} width={100} height={100} /> */}
          <div className="flex flex-col gap-2">
            <Badge className="rounded-md bg-[#fff5cb] px-2 py-1 text-sm font-medium text-[#8B5E3C] sm:text-base">
              {info.category}
            </Badge>
            <div className="flex flex-col gap-1">
              <span className="h-[2.5rem] text-sm leading-5 font-semibold sm:text-base">
                {info.name}
              </span>
              <span className="text-sm text-[#1E40AF] sm:text-base dark:text-[#DBEAFE]">
                {info.size}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold sm:text-base">{info.price}</span>
                <span className="bg-foreground h-5 w-[1.5px]"></span>
                <Badge className="rounded-md bg-green-600 text-sm font-medium text-white sm:text-base">
                  In
                </Badge>
              </div>
            </div>
            <span className="text-sm text-[#6B0F1A] sm:text-base dark:text-[#ffc82e]">
              {info.type}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
