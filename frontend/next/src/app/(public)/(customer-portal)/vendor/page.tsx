'use client';

import React from 'react';

import clsx from 'clsx';
import { Check, Clock, MapPin, Store, X } from 'lucide-react';

import { Badge } from '~/shared/shadcn/badge';

import CatalogDisplay from '~/components/customer/catalog';

type StoreInfo = {
  name: string;
  storeStatus: 'OPEN' | 'CLOSED'; // maybe extend for other statuses
  area: string;
  city: string;
  state: string;
  postalCode: string | number;
  openTime: string;
  closeTime: string;
  distance: number | string; // km
};

const baseStores: StoreInfo[] = [
  {
    name: 'Sri Eelamma Thali pochamma thali Wines',
    storeStatus: 'OPEN',
    area: 'Madhapur',
    city: 'Hyderabad',
    state: 'Telangana',
    postalCode: 500081,
    openTime: '10:00 AM',
    closeTime: '11:00 PM',
    distance: 2.5
  }
];

const mockStockData = {
  liquorItems: [
    {
      martName: 'Sri Eelamma Thali Wines',
      martStatus: 'OPEN',
      productName: 'Johnnie Walker Black Label',
      brandName: 'Johnnie Walker',
      category: 'Whiskey',
      type: 'Blended Scotch',
      price: '3500',
      size: '750ml',
      martLat: 17.4435,
      martLng: 78.3772
    },
    {
      martName: 'Classic Liquor Mart',
      martStatus: 'CLOSED',
      productName: 'Absolut Vodka',
      brandName: 'Absolut',
      category: 'Vodka',
      type: 'Premium Vodka',
      price: '2200',
      size: '1L',
      martLat: 17.4123,
      martLng: 78.4501
    },
    {
      martName: 'Thali Wines & Spirits',
      martStatus: 'OPEN',
      productName: 'Jack Daniel’s Old No. 7',
      brandName: 'Jack Daniel’s',
      category: 'Whiskey',
      type: 'Tennessee Whiskey',
      price: '2800',
      size: '750ml',
      martLat: 17.4275,
      martLng: 78.4012
    },
    {
      martName: 'Hyderabad Premium Wines',
      martStatus: 'OPEN',
      productName: 'Kingfisher Ultra',
      brandName: 'Kingfisher',
      category: 'Beer',
      type: 'Lager',
      price: '160',
      size: '650ml',
      martLat: 17.4456,
      martLng: 78.3923
    },
    {
      martName: 'Metro Spirits Hub',
      martStatus: 'CLOSED',
      productName: 'Sula Chenin Blanc',
      brandName: 'Sula',
      category: 'Wine',
      type: 'White Wine',
      price: '950',
      size: '750ml',
      martLat: 17.4557,
      martLng: 78.3658
    }
  ],
  isLoadingItems: false,
  pagination: {
    pageSize: 5,
    pageIndex: 0
  },
  setPagination: () => {
    console.log('New pagination:');
  },
  totalPages: 3
};

function Page() {
  return (
    <div className="mt-[-20px] flex w-full flex-col justify-center gap-8 md:gap-10">
      {baseStores.map((info, id) => (
        <div
          key={id}
          className="flex w-full flex-col items-center justify-center gap-8 rounded-2xl border border-amber-100 bg-gradient-to-r from-yellow-50 via-white to-yellow-50 p-8 shadow-md transition hover:shadow-xl sm:flex-row sm:gap-15 lg:gap-20">
          {/* Left section */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:flex-nowrap sm:justify-start">
              <Store className="!size-10 shrink-0 rounded-full bg-amber-100 p-2 text-amber-600 shadow-sm lg:!size-12" />
              <span className="text-center text-2xl font-bold tracking-tight wrap-break-word text-gray-900 sm:text-left lg:text-3xl">
                {info.name}
              </span>
            </div>

            <div className="sm:text-md flex flex-wrap items-center justify-center gap-0.5 text-sm sm:ml-3 sm:flex-nowrap sm:justify-start lg:text-base">
              <MapPin className="!size-4 shrink-0 text-amber-600 sm:!size-5" />
              <span className="ml-1 text-center sm:text-left">
                {info.area}, {info.city}, {info.state} - {info.postalCode}
              </span>
            </div>
          </div>

          {/* Right section */}
          <div className="flex flex-col items-center gap-4 sm:items-start">
            <div className="flex gap-5 sm:flex-col sm:gap-4">
              <div className="flex items-center gap-2">
                <Badge
                  className={clsx(
                    'flex items-center justify-center rounded-full text-xs font-semibold text-white shadow md:px-3 md:py-1 lg:text-sm',
                    info.storeStatus === 'CLOSED' ? 'bg-red-600' : 'bg-green-600'
                  )}>
                  {info.storeStatus === 'CLOSED' ? (
                    <X strokeWidth={3} className="size-4" />
                  ) : (
                    <Check strokeWidth={3} className="size-4" />
                  )}
                </Badge>
                <span
                  className={clsx(
                    'text-base font-medium lg:text-lg',
                    info.storeStatus === 'CLOSED' ? 'text-red-600' : 'text-green-600'
                  )}>
                  {info.storeStatus}
                </span>
              </div>

              {/* Timing */}
              <div className="flex items-center gap-2 text-sm whitespace-nowrap sm:text-base lg:text-lg">
                <Clock className="h-4 w-4 text-amber-600" />
                <span className="font-medium">
                  {info.openTime} – {info.closeTime}
                </span>
              </div>
            </div>

            {/* Distance + Locate */}
            <div className="ml-1 flex items-center gap-4">
              <span className="flex items-center gap-1 text-sm font-semibold text-[#6B0F1A] sm:text-base lg:text-lg dark:text-[#ffc82e]">
                {info.distance} km
              </span>
              <span className="h-5 w-[1px] bg-gray-300" />
              <span className="flex cursor-pointer items-center text-[15px] font-medium text-blue-600 hover:text-blue-700 hover:underline sm:text-base lg:text-lg">
                locate ↗
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* CatalogDisplay with fake data */}
      <CatalogDisplay
        liquorItems={mockStockData.liquorItems}
        isLoadingItems={mockStockData.isLoadingItems}
        pagination={mockStockData.pagination}
        setPagination={mockStockData.setPagination}
        totalPages={mockStockData.totalPages}
      />
    </div>
  );
}

export default Page;
