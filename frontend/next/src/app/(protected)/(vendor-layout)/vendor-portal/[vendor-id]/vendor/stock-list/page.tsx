'use client';

import * as React from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import { Loader2, MoreHorizontal, Pencil } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '~/shared/shadcn/button';
import { Checkbox } from '~/shared/shadcn/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/shared/shadcn/dropdown-menu';
import { Input } from '~/shared/shadcn/input';
import { ToggleGroup, ToggleGroupItem } from '~/shared/shadcn/toggle-group';
import { ComponentLoader } from '~/shared/components/componentLoader';
import { DataTable } from '~/shared/components/dataTable';

import { trpcHttp } from '~/utils/trpc';

import type { ColumnDef } from '@tanstack/react-table';

type StockItem = {
  id: string;
  brand: string;
  productName: string;
  category: string;
  type: string | null;
  size: string;
  price: string;
  availability: boolean;
};

export default function Page() {
  const [stockFilter, setStockFilter] = React.useState<'all' | 'in' | 'out'>('all');
  const [search, setSearch] = React.useState('');
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 4
  });

  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([]);

  // fetching vendor Stock Data
  const {
    data: stockData,
    isLoading,
    refetch: refetchVendorStocks
  } = useQuery(
    trpcHttp.stock.getVendorStock.queryOptions({
      search,
      stockFilter,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize
    })
  );

  const { mutateAsync: updateStock, isPending: isUpdatingStock } = useMutation(
    trpcHttp.stock.updateVendorStock.mutationOptions({
      onSuccess: () => {
        toast.success('Successfully Updated Stock(s)');
        refetchVendorStocks();
        setSelectedRowIds([]);
      },
      onError: (err) => {
        setSelectedRowIds([]);
        toast.error('Error While Updating Stock');
        console.error('Failed to update stock:', err);
      }
    })
  );

  const handleMassUpdate = (newStatus: boolean) => {
    if (selectedRowIds.length === 0) {
      toast.error('Please select at least one item to update.');
      return;
    }
    console.log(selectedRowIds);
    updateStock({ stockIds: selectedRowIds, availability: newStatus });
  };

  const handleIndividualUpdate = (stockId: string, newStatus: boolean) => {
    updateStock({ stockIds: [stockId], availability: newStatus });
  };

  const columns: ColumnDef<StockItem>[] = [
    {
      id: 'select_sno',
      header: () => (
        <div className="mr-5 flex items-center gap-2 font-medium">
          <span>Select</span>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedRowIds.includes(row.original.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  // Add the ID only if it's not already in the array to prevent duplicates
                  if (!selectedRowIds.includes(row.original.id)) {
                    setSelectedRowIds([...selectedRowIds, row.original.id]);
                  }
                } else {
                  // Filter out the ID
                  setSelectedRowIds(selectedRowIds.filter((id) => id !== row.original.id));
                }
              }}
              aria-label="Select row"
            />
            <span>{row.index + 1}</span>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false
    },
    {
      id: 'Brand-Product',
      header: 'Brand / Product',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium sm:text-lg">{item.brand}</span>
            <span className="text-sm font-normal sm:text-lg">{item.productName}</span>
          </div>
        );
      }
    },
    {
      id: 'Category-Type',
      header: 'Category / Type',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-normal sm:text-lg">{item.category}</span>
            <span className="text-sm font-normal sm:text-lg">{item.type}</span>
          </div>
        );
      }
    },
    {
      id: 'Size-Price',
      header: 'Size / Price',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-normal sm:text-lg">{item.size}</span>
            <span className="text-sm font-normal sm:text-lg">{item.price}</span>
          </div>
        );
      }
    },
    {
      id: 'availability',
      header: () => <div className="text-right">Availability</div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex justify-end">
            <ToggleGroup
              type="single"
              value={item.availability ? 'in' : 'out'}
              onValueChange={(val) => {
                if (val) {
                  const newStatus = val === 'in';
                  if (newStatus !== item.availability) {
                    handleIndividualUpdate(item.id, newStatus);
                  }
                }
              }}
              className="bg-muted grid w-max grid-cols-2 rounded-xl p-1">
              <ToggleGroupItem
                value="in"
                aria-label="In Stock"
                className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm data-[state=on]:bg-green-600">
                In
              </ToggleGroupItem>
              <ToggleGroupItem
                value="out"
                aria-label="Out of Stock"
                className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm data-[state=on]:bg-red-500">
                Out
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        );
      }
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Pencil />
              Edit Product
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Button className="mt-1" variant="destructive">
                Remove Product
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-3 p-3 lg:px-10">
      <h1 className="font-medium md:text-2xl">
        <strong>All the Stock</strong> Listed
      </h1>

      <div className="flex flex-col items-start gap-3 sm:gap-5 lg:flex-row">
        {/* Top filter toggle */}
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:gap-5">
          <ToggleGroup
            type="single"
            value={stockFilter}
            onValueChange={(val) => val && setStockFilter(val as 'all' | 'in' | 'out')}
            className="bg-background flex w-[300px]">
            <ToggleGroupItem value="all" aria-label="All Stock">
              All Stock
            </ToggleGroupItem>
            <ToggleGroupItem value="in" aria-label="In Stock">
              In Stock
            </ToggleGroupItem>
            <ToggleGroupItem value="out" aria-label="Out of Stock">
              Out of Stock
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Stock updation buttons */}
        <div className="flex items-start gap-3">
          <Button
            className="w-fit bg-green-600 text-white"
            onClick={() => handleMassUpdate(true)}
            disabled={isUpdatingStock || selectedRowIds.length === 0}>
            {isUpdatingStock ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update to In-Stock'}
          </Button>
          <Button
            className="w-fit bg-red-600 text-white"
            onClick={() => handleMassUpdate(false)}
            disabled={isUpdatingStock || selectedRowIds.length === 0}>
            {isUpdatingStock ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Update to Out-of-Stock'
            )}
          </Button>
        </div>
      </div>

      <div className="mt-3 gap-2 py-0">
        <Input
          placeholder="Search by stock name..."
          className="mb-3 max-w-[100%] text-sm sm:w-[50%] md:text-lg"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        {isLoading ? (
          <ComponentLoader />
        ) : (
          <DataTable
            columns={columns}
            data={stockData?.vendorStocks ?? []}
            pagination={pagination}
            onPaginationChange={setPagination}
            totalRowCount={stockData?.totalCount ?? 0}
          />
        )}
      </div>
    </div>
  );
}
