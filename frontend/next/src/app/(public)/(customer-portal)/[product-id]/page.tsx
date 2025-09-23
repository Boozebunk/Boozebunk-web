'use client';

import React from 'react';

import { Store } from 'lucide-react';

import { Badge } from '~/shared/shadcn/badge';

import { ProductCard } from '~/components/customer/product-card';

type ProductCardProps = {
  image: string;
  category: string;
  name: string;
  size: string;
  price: string | number;
  type: string;
};

const baseProducts: ProductCardProps[] = [
  {
    image: 'https://www.livcheers.com/static/content/images/liquor/LCIN01896.webp',
    name: 'Johnnie Walker Blue Label',
    category: 'Whiskey',
    type: 'Blended Scotch',
    size: '750ml',
    price: 12000
  }
];

function Page() {
  return (
    <div className="flex w-full flex-col justify-center gap-8 md:gap-10">
      <div className="max-w-8xl flex w-full flex-col gap-16 px-5 sm:px-10">
        {baseProducts.map((info, id) => (
          <div
            key={id}
            className="flex w-full flex-col items-start gap-0 rounded-xl border bg-white p-5 shadow-md sm:flex-row sm:gap-12 dark:bg-neutral-900">
            {/* IMAGE */}
            <div className="flex w-full justify-center sm:w-1/4 sm:justify-start">
              <div className="aspect-[9/5] w-full max-w-sm overflow-hidden rounded-lg sm:h-[350px] sm:w-[350px]">
                {/* <img src={info.image} alt={info.name} className="h-full w-full object-contain" /> */}
              </div>
            </div>

            {/* DETAILS */}
            <div className="flex w-full flex-col gap-3 sm:gap-8">
              {/* Category */}
              <Badge className="rounded-md bg-[#fff5cb] px-3 py-1 text-sm font-medium text-[#8B5E3C] sm:text-lg">
                {info.category}
              </Badge>

              {/* Name + Price + Size */}
              <div className="flex flex-col gap-2 sm:gap-5">
                <span className="text-2xl font-semibold sm:text-3xl lg:text-5xl">{info.name}</span>
                <div className="flex items-center gap-6">
                  <span className="text-xl font-medium sm:text-3xl">₹{info.price}</span>
                  <span className="bg-foreground h-5 w-[1px]"></span>
                  <span className="text-xl text-[#1E40AF] sm:text-3xl dark:text-[#DBEAFE]">
                    {info.size}
                  </span>
                </div>
              </div>

              {/* Type + Stock */}
              <div className="flex items-center gap-6">
                <span className="text-lg text-[#6B0F1A] sm:text-2xl dark:text-[#ffc82e]">
                  {info.type}
                </span>
                <Badge className="rounded-md bg-green-100 text-sm font-medium text-green-600 sm:text-base">
                  In-Stock
                </Badge>
              </div>

              {/* Store */}
              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground text-sm font-medium sm:text-lg">From</span>
                <div className="flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 shadow-sm transition-shadow hover:shadow-md">
                  <Store className="h-5 w-5 shrink-0 text-amber-600" />
                  <span className="text-sm font-semibold sm:text-lg">
                    Sri Elammathali Pochammathali Wines
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col items-start gap-5 px-5 pb-[-3] sm:px-10">
        <h1 className="text-2xl font-medium md:text-3xl">
          Explore{' '}
          <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text font-bold text-transparent">
            Other Products
          </span>
        </h1>

        <div className="w-full overflow-x-auto scroll-smooth pb-3">
          <div className="flex gap-5 lg:gap-8">
            {Array(10)
              .fill(null)
              .map((_, repeatIdx) =>
                baseProducts.map((info, idx) => (
                  <div key={`${repeatIdx}-${idx}`} className="min-w-[250px] flex-shrink-0">
                    <ProductCard info={info} />
                  </div>
                ))
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
