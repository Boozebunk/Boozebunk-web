'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Check, Clock, Loader2, MapPin, Search, Store, X } from 'lucide-react';

import { Badge } from '~/shared/shadcn/badge';
import { Input } from '~/shared/shadcn/input';

import CatalogDisplay from '~/components/customer/catalog';
import { useCustomerContext } from '~/providers/customer-provider';
import { trpcHttp } from '~/utils/trpc';

function Page() {
  const params = useParams();
  const vendorId = params['vendorId'] as string;

  const [searchStock, setSearchStock] = useState<string>('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  });

  const { location } = useCustomerContext();

  const [debouncedSearchStock, setDebouncedSearchStock] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchStock(searchStock);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchStock]);

  const { data: martDetails, isLoading: loadingMartDetails } = useQuery(
    trpcHttp.customer.getMartDetailsById.queryOptions({
      vendorId: vendorId,
      customerLat: location.lat ?? 0,
      customerLon: location.lon ?? 0
    })
  );

  const { data: martStocks, isLoading: loadingMartStocks } = useQuery(
    trpcHttp.customer.getMartStockById.queryOptions({
      vendorId: vendorId,
      search: debouncedSearchStock,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize
    })
  );

  const handleLocate = () => {
    const lat = martDetails?.martDetails.martLat;
    const lng = martDetails?.martDetails.martLng;
    if (lat && lng) {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      window.open(googleMapsUrl, '_blank');
    } else {
      console.warn('Coordinates missing');
    }
  };

  return (
    <div className="mt-[-20px] flex w-full flex-col justify-center gap-8 md:gap-10">
      <div className="flex w-full flex-col items-center justify-center gap-8 rounded-2xl border border-amber-100 bg-gradient-to-r from-yellow-50 via-white to-yellow-50 p-8 shadow-md transition sm:flex-row sm:gap-15 lg:gap-20 lg:hover:shadow-xl">
        {loadingMartDetails ? (
          <div className="flex h-40 w-full items-center justify-center">
            <div className="flex items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-lg font-medium">Loading mart...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:flex-nowrap sm:justify-start">
                <Store className="!size-10 shrink-0 rounded-full bg-amber-100 p-2 text-amber-600 shadow-sm lg:!size-12" />
                <span className="text-center text-2xl font-bold tracking-tight wrap-break-word text-gray-900 sm:text-left lg:text-3xl">
                  {martDetails?.martDetails.martName}
                </span>
              </div>

              <div className="sm:text-md flex flex-wrap items-center justify-center gap-0.5 text-sm sm:ml-3 sm:flex-nowrap sm:justify-start lg:text-base">
                <MapPin className="!size-4 shrink-0 text-amber-600 sm:!size-5" />
                <span className="ml-1 text-center sm:text-left">
                  {martDetails?.martDetails.martAddress}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 sm:items-start">
              <div className="flex gap-5 sm:flex-col sm:gap-4">
                <div className="flex items-center gap-2">
                  <Badge
                    className={clsx(
                      'flex items-center justify-center rounded-full text-xs font-semibold text-white shadow md:px-3 md:py-1 lg:text-sm',
                      martDetails?.martDetails.martStatus === 'CLOSED'
                        ? 'bg-red-600'
                        : 'bg-green-600'
                    )}>
                    {martDetails?.martDetails.martStatus === 'CLOSED' ? (
                      <X strokeWidth={3} className="size-4" />
                    ) : (
                      <Check strokeWidth={3} className="size-4" />
                    )}
                  </Badge>
                  <span
                    className={clsx(
                      'text-base font-medium lg:text-lg',
                      martDetails?.martDetails.martStatus === 'CLOSED'
                        ? 'text-red-600'
                        : 'text-green-600'
                    )}>
                    {martDetails?.martDetails.martStatus}
                  </span>
                </div>

                {/* Timing */}
                <div className="flex items-center gap-2 text-sm whitespace-nowrap sm:text-base lg:text-lg">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="font-medium">
                    {martDetails?.martDetails.martOpenTime} –{' '}
                    {martDetails?.martDetails.martCloseTime}
                  </span>
                </div>
              </div>

              {/* Distance + Locate */}
              <div className="ml-1 flex items-center gap-4">
                <span className="flex items-center gap-1 text-sm font-semibold text-[#6B0F1A] sm:text-base lg:text-lg dark:text-[#ffc82e]">
                  {martDetails?.martDetails.distanceMeters !== undefined
                    ? (martDetails.martDetails.distanceMeters / 1000).toFixed(1)
                    : 'N/A'}{' '}
                  km
                </span>
                <span className="h-5 w-[1px] bg-gray-300" />
                <span className="flex cursor-pointer items-center text-[15px] font-medium text-blue-600 hover:text-blue-700 hover:underline sm:text-base lg:text-lg">
                  <span
                    onClick={handleLocate}
                    className="flex cursor-pointer items-center bg-none text-sm text-blue-600 hover:text-blue-700 hover:underline lg:text-lg">
                    locate ↗
                  </span>
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 px-5">
        <h1 className="text-center text-xl font-semibold sm:text-2xl">
          Explore Our
          <span className="ml-2 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
            Stock
          </span>
        </h1>
        <div className="relative w-full max-w-[600px]">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 lg:h-5 lg:w-5" />
          <Input
            className="w-full rounded-2xl border py-4 pr-3 pl-10 text-sm shadow-sm transition-all duration-200 sm:text-base lg:text-lg"
            type="text"
            placeholder="Search stock"
            value={searchStock}
            onChange={(e) => {
              setSearchStock(e.target.value);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
          />
        </div>
      </div>

      {loadingMartStocks ? (
        <div className="flex h-40 w-full items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-lg font-medium">Loading...</span>
          </div>
        </div>
      ) : (
        <CatalogDisplay
          liquorItems={martStocks?.martStocks ?? []}
          pagination={pagination}
          setPagination={setPagination}
          totalPages={martStocks?.totalCount ?? 0}
        />
      )}
    </div>
  );
}

export default Page;
