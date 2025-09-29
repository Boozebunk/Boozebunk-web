'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';

import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { Button } from '~/shared/shadcn/button';

import StockDisplay from '~/components/customer/stocks-display';
import { VendorCard } from '~/components/customer/vendor-card';
import { useCustomerContext } from '~/providers/customer-provider';
import { trpcHttp } from '~/utils/trpc';

const go_to_categories = [
  { name: 'Beer', image: '/assets/categories/beer.jpg' },
  { name: 'Wine', image: '/assets/categories/wine.jpg' },
  { name: 'Whiskey', image: '/assets/categories/whiskey.jpg' },
  { name: 'Vodka', image: '/assets/categories/vodka.jpg' },
  { name: 'Rum', image: '/assets/categories/rum.jpg' },
  { name: 'Gin', image: '/assets/categories/gin.jpg' },
  { name: 'Tequila', image: '/assets/categories/tequila.jpg' },
  { name: 'Brandy', image: '/assets/categories/brandy.jpg' },
  { name: 'Cocktails', image: '/assets/categories/cocktail.jpg' },
  { name: 'Champagne', image: '/assets/categories/champagne.jpg' }
];

function Page() {
  // ------------location access of lat and long-----------------
  const { locationStatus, nearbyVendors, nearbyVendorsLoading, selectedCity } =
    useCustomerContext();
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageIndex: 0
  });

  const [selectedCategory, setSelectedCategory] = useState('');

  //Getting Stock based on City
  const { data: stocks, isLoading: loadingStocks } = useQuery(
    trpcHttp.customer.getStockDisplay.queryOptions(
      {
        city: selectedCity,
        category: selectedCategory,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize
      },
      {
        enabled: selectedCity !== ''
      }
    )
  );

  const myDivRef = useRef<HTMLDivElement>(null);

  function handleCategoryClick(name: React.SetStateAction<string>) {
    setSelectedCategory(name);

    if (myDivRef.current) {
      const yOffset = -100;
      const y = myDivRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-8 sm:gap-15">
      {/* STORES NEAR YOU */}
      <div className="mb-[-3] flex w-full flex-col gap-5 overflow-hidden px-5 md:gap-8 lg:px-25">
        <div className="flex flex-col items-center gap-0 md:gap-1">
          <h1 className="text-center text-2xl font-bold md:text-3xl">
            Stores Near{' '}
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              You
            </span>
          </h1>
          <p className="text-center text-sm text-gray-500">Discover stores around your area.</p>
        </div>

        <div className="w-full overflow-x-auto scroll-smooth pb-3 [&::-webkit-scrollbar]:hidden">
          {locationStatus === 'loading' || nearbyVendorsLoading ? (
            <div className="flex h-40 w-full items-center justify-center">
              <div className="flex items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-lg font-medium">Loading stores...</span>
              </div>
            </div>
          ) : locationStatus === 'granted' && nearbyVendors && nearbyVendors.length > 0 ? (
            <div className="flex min-w-max items-center justify-center gap-5 lg:gap-8">
              {nearbyVendors.map((info, id) => (
                <div key={id}>
                  <VendorCard
                    info={{
                      id: info.id,
                      name: info.martName,
                      distance: (info.distanceMeters / 1000).toFixed(1), // Convert meters to kilometers
                      storeStatus: info.storeStatus,
                      martLat: info.martLat,
                      martLng: info.martLng,
                      area: info.martArea ?? '',
                      city: info.martCity ?? '',
                      state: info.martState ?? '',
                      postalCode: info.martPostalCode ?? '',
                      openTime: info.martOpenTime,
                      closeTime: info.martCloseTime
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3">
              <p className="text-center text-sm sm:text-base">
                {locationStatus === 'denied'
                  ? 'Location access is denied. Please enable it in your browser or device settings and refresh.'
                  : 'No stores found near your location.'}
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="cursor-pointer text-sm sm:text-base">
                Refresh
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* DIVIDER */}
      <div className="h-[2px] w-[95%] bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

      {/* CATEGORIES */}
      <div className="flex w-fit flex-col items-center gap-5 px-5 md:gap-8 lg:px-25">
        <div className="flex flex-col items-center gap-0 md:gap-1">
          <h1 className="text-center text-2xl font-bold md:text-3xl">
            Go-To{' '}
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Categories
            </span>
          </h1>
          <p className="text-center text-sm text-gray-500">View by category you love.</p>
        </div>

        <div className="grid grid-cols-4 gap-x-4 gap-y-6 sm:grid-cols-5 sm:gap-x-10 lg:gap-x-20">
          {go_to_categories.map(({ name, image }, idx) => (
            <div
              onClick={() => handleCategoryClick(name)}
              key={idx}
              className="flex w-fit cursor-pointer flex-col items-center gap-2 md:gap-3">
              <div className="relative h-[80px] w-[80px] rounded-full bg-gradient-to-tr from-yellow-400 to-orange-400 p-[2px] transition-transform hover:scale-105 sm:h-[100px] sm:w-[100px] lg:h-[150px] lg:w-[150px]">
                <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
                  <Image src={image} alt={name} fill className="object-cover" />
                </div>
              </div>

              <span className="text-xs font-semibold text-gray-700 md:text-sm">{name}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={() => {
            setSelectedCategory('');
            if (myDivRef.current) {
              const yOffset = -100;
              const y = myDivRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }}>
          All Categories
        </Button>
      </div>

      {/* DIVIDER */}
      <div className="h-[2px] w-[95%] bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

      <StockDisplay
        ref={myDivRef}
        liquorItems={stocks?.items ?? []}
        isLoadingItems={loadingStocks}
        pagination={pagination}
        setPagination={setPagination}
        totalPages={stocks?.totalItemsCount ?? 0}
      />
    </div>
  );
}

export default Page;
