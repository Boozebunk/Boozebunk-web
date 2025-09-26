'use client';

import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

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
            <div className="absolute z-10 mt-1 w-full space-y-2 rounded-md border bg-white p-2 shadow-md">
              {searchResults.stockItems.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{item.brandName}</h3>
                        <Badge variant="secondary">{item.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{item.productName}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-green-600">₹{item.price}</span>
                        <span className="text-sm text-gray-500">{item.size}</span>
                      </div>
                      <div className="border-t pt-2">
                        <h4 className="text-sm font-semibold text-gray-700">{item.martName}</h4>
                        <p className="text-xs text-gray-600">
                          {[item.martArea, item.martCity, item.martState]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs">
                          <Badge
                            variant={item.storeStatus === 'OPEN' ? 'secondary' : 'destructive'}>
                            {item.storeStatus}
                          </Badge>
                          <span className="text-gray-500">
                            {item.martOpenTime} - {item.martCloseTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 p-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        handleLocate(item.martLat, item.martLng);
                      }}>
                      Locate Store
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )
        )}
      </form>
    </div>
  );
}
