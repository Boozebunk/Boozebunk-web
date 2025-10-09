'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { ArrowUpRight, Clock, Loader2, MapPin, Search } from 'lucide-react';

import { Badge } from '~/shared/shadcn/badge';
import { Button } from '~/shared/shadcn/button';
import { Card, CardContent, CardFooter } from '~/shared/shadcn/card';
import { Input } from '~/shared/shadcn/input';

import { useCustomerContext } from '~/providers/customer-provider';
import { trpcHttp } from '~/utils/trpc';

interface LiquorSearchProps {
  isSearchDisabled: boolean;
}

export default function LiquorSearch({ isSearchDisabled }: LiquorSearchProps) {
  const [query, setQuery] = React.useState('');
  const [searchStock, setSearchStock] = React.useState('');

  const { nearbyVendors } = useCustomerContext();
  const nearbyVendorIds = nearbyVendors?.map((v) => v.id);

  // tRPC query to search for stock in nearby vendors
  const { data: searchResults, isLoading: isSearchLoading } = useQuery(
    trpcHttp.customer.searchStock.queryOptions(
      {
        searchQuery: searchStock,
        vendorIds: nearbyVendorIds
      },
      {
        enabled: !isSearchDisabled && searchStock.length > 0
      }
    )
  );

  const handleLocate = (lat: number, lng: number) => {
    if (lat && lng) {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      window.open(googleMapsUrl, '_blank');
    } else {
      console.warn('Coordinates missing for mart:');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() !== '') {
      setSearchStock(query);
      setQuery('');
    }
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Open dropdown whenever searchStock has value
  useEffect(() => {
    setIsDropdownOpen(searchStock.length > 0);
  }, [searchStock]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 lg:h-5 lg:w-5" />
          <Input
            placeholder={
              isSearchDisabled
                ? 'Turn on location to Search!'
                : 'Search liquor brands, products, categories...'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl py-5 pr-3 pl-10 sm:!text-sm md:!text-base lg:!text-lg"
            disabled={isSearchDisabled}
          />
        </div>

        {/* Dropdown */}
        {isSearchLoading ? (
          <div className="absolute z-10 mt-1 w-full rounded-md border bg-white p-4 text-center shadow-md">
            <Loader2 className="inline-block h-4 w-4 animate-spin" /> Searching...
          </div>
        ) : (
          searchResults &&
          isDropdownOpen &&
          searchResults.stockItems.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute z-10 mt-1 max-h-[55vh] w-full space-y-2 overflow-auto rounded-md border bg-white p-2 shadow-md">
              {searchResults.stockItems.map((item, index) => (
                <>
                  <div
                    className={clsx('bg-foreground flex h-[1px] w-full', index === 0 && 'hidden')}
                  />
                  <Card key={index} className="gap-2 overflow-hidden border-none p-5 shadow-none">
                    {item.productImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.productImageUrl}
                        alt={item.productName}
                        className="h-[100px] w-[100px] rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-[60px] w-[60px] items-center justify-center rounded-md bg-gray-100">
                        No image
                      </div>
                    )}
                    <CardContent className="p-0">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-0">
                            <span className="text-xs font-medium text-[#1e69af] sm:text-sm">
                              {item.brandName}
                            </span>
                            <span className="h-[2.5rem] text-sm leading-5 font-semibold sm:text-base">
                              {item.productName}
                            </span>
                          </div>
                          <Badge className="bg-[#fff5cb] text-[#8B5E3C]" variant="secondary">
                            {item.category}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold sm:text-base">₹{item.price}</span>
                          <span className="text-sm font-medium text-[#1E40AF] dark:text-[#DBEAFE]">
                            {item.size}
                          </span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="text-sm">
                            At:
                            <span className="ml-1 font-semibold text-amber-600">
                              {item.martName}
                            </span>
                          </div>
                          <div className="flex h-[2.5rem] flex-wrap items-center text-[13px] sm:text-sm">
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="h-4 w-4 shrink-0" />
                              <span className="max-w-[250px] truncate">{item.martArea}</span>
                              <span>,</span>
                            </span>
                            <span className="ml-1 whitespace-nowrap">
                              {' '}
                              {item.martCity}, {item.martState}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs">
                            <span
                              className={clsx(
                                'text-xs font-medium',
                                item.storeStatus === 'OPEN' ? 'text-green-600' : 'text-red-600'
                              )}>
                              {item.storeStatus}
                            </span>
                            <span className="text-muted-foreground flex items-center gap-1 text-sm">
                              <Clock className="h-4 w-4" />
                              {item.martOpenTime} - {item.martCloseTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full cursor-pointer"
                        onClick={() => {
                          handleLocate(item.martLat, item.martLng);
                        }}>
                        Locate Store
                        <ArrowUpRight className="ml-[-5] h-5 w-5" strokeWidth={1.75} />
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              ))}
            </div>
          )
        )}
      </form>
    </div>
  );
}
