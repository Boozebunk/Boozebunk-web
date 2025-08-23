'use client';

import * as React from 'react';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, MoreHorizontal } from 'lucide-react';

import { Button } from '~/shared/shadcn/button';
import { Calendar } from '~/shared/shadcn/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/shared/shadcn/dropdown-menu';
import { Input } from '~/shared/shadcn/input';
import { Popover, PopoverContent, PopoverTrigger } from '~/shared/shadcn/popover';
import { ComponentLoader } from '~/shared/components/componentLoader';
import { DataTable } from '~/shared/components/dataTable';

import { VendorsOverview } from '~/components/vendors-list/vendorsOverview';
import { trpcHttp } from '~/utils/trpc';

import type { ColumnDef } from '@tanstack/react-table';
import type { DateRange } from 'react-day-picker';

export type VendorsDataType = {
  id: string;
  martName: string;
  vendorName: string | null;
  phoneNumber: string | null;
  RegisteredOn: Date;
  isActive: boolean;
  licenseNumber: string | null;
  vendorEmail: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressPostalCode: string | null;
  addressArea: string | null;
};

export default function Page() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [search, setSearch] = React.useState('');
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 4
  });
  const [isActive, setIsActive] = React.useState(true);

  const columns: ColumnDef<VendorsDataType>[] = [
    {
      id: 'sno',
      header: () => <div className="w-12 text-center">S.No</div>,
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>
    },
    {
      accessorKey: 'martName',
      header: () => (
        <Button className="text-sm md:text-xl" variant="ghost" onClick={() => {}}>
          Mart Name
        </Button>
      ),
      cell: ({ row }) => {
        const vendor = row.original;
        return (
          <div className="ml-3 flex flex-col gap-1 font-medium">
            <span>{vendor.martName}</span>
            <span>{vendor.licenseNumber}</span>
          </div>
        );
      }
    },
    {
      id: 'vendorDetails',
      header: 'Vendor Details',
      cell: ({ row }) => {
        const vendor = row.original;
        return (
          <div className="flex flex-col space-y-1 text-sm">
            <div className="font-medium">{vendor.vendorName}</div>
            <div className="text-muted-foreground lowercase">{vendor.vendorEmail}</div>
            <div className="text-muted-foreground">{vendor.phoneNumber}</div>
          </div>
        );
      }
    },
    {
      id: 'location',
      header: 'Location',
      cell: ({ row }) => {
        const vendor = row.original;
        return (
          <div className="flex flex-col gap-1 text-sm leading-tight lg:flex-row">
            {vendor.addressArea},{' '}
            <span className="text-muted-foreground">
              {vendor.addressCity}, {vendor.addressState}
            </span>
            <span>{vendor.addressPostalCode}</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'Registered On',
      header: () => <div className="text-right">Last Registered</div>,
      cell: ({ row }) => {
        const vendor = row.original;
        const date = new Date(vendor.RegisteredOn);
        const formatted = format(date, 'yyyy-MM-dd');
        return <div className="text-right text-sm">{formatted}</div>;
      }
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const vendor = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit vendor</DropdownMenuItem>
              <DropdownMenuSeparator />
              {vendor.isActive ? (
                <DropdownMenuItem>Freeze vendor</DropdownMenuItem>
              ) : (
                <DropdownMenuItem>Activate vendor</DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-red-600">Delete vendor</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  const { data: vendorsList, isLoading } = useQuery(
    trpcHttp.vendor.getVendorsList.queryOptions({
      search,
      isActive,
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize
    })
  );

  return (
    <div>
      <VendorsOverview />
      <div className="flex flex-col gap-3 p-3 lg:px-10">
        <h1 className="font-medium md:text-2xl">
          <strong>List</strong> of all the Vendors
        </h1>

        {/* Filters Row */}
        <div className="flex flex-col items-start gap-3 sm:flex-row">
          {/*Active/Frozen filter*/}
          <div className="flex flex-row gap-2">
            <Button onClick={() => setIsActive(true)}>Active</Button>
            <Button variant="secondary" onClick={() => setIsActive(false)}>
              Froozen
            </Button>
          </div>

          {/* Search Bar */}
          <div className="flex flex-row items-start gap-5 pb-4">
            <Input
              placeholder="Find vendor by any shown details below..."
              className="max-w-[550px] text-sm md:text-lg"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>

          {/* Date filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`max-w-[250px] justify-between text-left font-normal ${
                  !dateRange?.from && 'text-muted-foreground'
                }`}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from && dateRange?.to ? (
                  <>
                    {format(dateRange.from, 'MMM dd, yyyy')} -{' '}
                    {format(dateRange.to, 'MMM dd, yyyy')}
                  </>
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range || undefined);
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Vendors Table */}
        {isLoading ? (
          <ComponentLoader />
        ) : (
          <div className="gap-2 py-0">
            <DataTable
              columns={columns}
              data={vendorsList?.vendorsData ?? []}
              pagination={pagination}
              onPaginationChange={setPagination}
              totalRowCount={vendorsList?.totalCount ?? 0}
            />
          </div>
        )}
      </div>
    </div>
  );
}
