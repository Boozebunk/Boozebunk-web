'use client';

import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { cn } from '~/lib/utils';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() !== '') {
      setSearchStock(query);
      setQuery('');
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <Input
          placeholder="Search liquor brands, products, categories..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          className="pr-10"
          disabled={isSearchDisabled}
        />
        {/* Dropdown */}
        {isSearchLoading ? (
          <div className="absolute z-10 mt-1 w-full rounded-md border bg-white p-4 text-center shadow-md">
            <Loader2 className="inline-block h-4 w-4 animate-spin" /> Searching...
          </div>
        ) : (
          searchResults &&
          searchResults.stockItems.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-md">
              {searchResults.stockItems.map((item, index) => (
                <div
                  key={index}
                  className={cn('cursor-pointer px-3 py-2 text-sm hover:bg-gray-100')}>
                  {item.brand} - {item.productName} ({item.price})
                </div>
              ))}
            </div>
          )
        )}
      </form>
    </div>
  );
}
