'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { ArrowUpRight, Loader2, Search } from 'lucide-react';

import { Badge } from '~/shared/shadcn/badge';
import { Button } from '~/shared/shadcn/button';
import { Card, CardContent, CardFooter } from '~/shared/shadcn/card';
import { Input } from '~/shared/shadcn/input';

import { useCustomerContext } from '~/providers/customer-provider';
import { trpcHttp } from '~/utils/trpc';

export default function CatalogSearch() {
  const [query, setQuery] = React.useState('');
  const [searchStock, setSearchStock] = React.useState('');

  const { nearbyVendors } = useCustomerContext();
  const nearbyVendorIds = nearbyVendors?.map((v) => v.id);

  // tRPC query to search for stock in nearby vendors
  const { data: searchResults, isLoading: isSearchLoading } = useQuery(
    trpcHttp.customer.searchStock.queryOptions({
      searchQuery: searchStock,
      vendorIds: nearbyVendorIds
    })
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
    <div className="w-full max-w-[600px] space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 lg:h-5 lg:w-5" />
          <Input
            placeholder="Search liquor brands, products, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-3xl py-4 pr-4 pl-10 text-sm shadow-md transition duration-300 ease-in-out hover:shadow-lg sm:text-base lg:text-lg"
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
                    <CardContent className="p-0">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          {/* <h3 className="font-semibold">{item.brandName}</h3> */}
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
                        View
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
