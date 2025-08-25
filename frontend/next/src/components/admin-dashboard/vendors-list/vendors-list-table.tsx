'use client';

import * as React from 'react';

import { format } from 'date-fns';
import { CalendarIcon, MoreHorizontal } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '~/shared/shadcn/alert-dialog';
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
import { DataTable } from '~/shared/components/dataTable';

import type { ColumnDef } from '@tanstack/react-table';
import type { DateRange } from 'react-day-picker';

export type Vendor = {
  id: string;
  martName: string;
  vendorName: string;
  email: string;
  phone: string;
  location: {
    area: string;
    city: string;
    state: string;
  };
  lastRegistered: string;
};

// Sample Data
const SampleData: Vendor[] = [
  {
    id: 'v1',
    martName: 'FreshBazaar',
    vendorName: 'Ravi Kumar',
    email: 'ravi.kumar@example.com',
    phone: '98765-12345',
    location: {
      area: 'Connaught Place',
      city: 'New Delhi',
      state: 'Delhi'
    },
    lastRegistered: '2023-11-15T08:30:00Z'
  },
  {
    id: 'v2',
    martName: 'GreenMart',
    vendorName: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '98234-56789',
    location: {
      area: 'Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra'
    },
    lastRegistered: '2024-01-10T12:00:00Z'
  }
];

// Columns
const columns: ColumnDef<Vendor>[] = [
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
    cell: ({ row }) => <div className="ml-3 font-medium">{row.getValue('martName')}</div>
  },
  {
    id: 'vendorDetails',
    header: 'Vendor Details',
    cell: ({ row }) => {
      const vendor = row.original;
      return (
        <div className="flex flex-col space-y-1 text-sm">
          <div className="font-medium">{vendor.vendorName}</div>
          <div className="text-muted-foreground lowercase">{vendor.email}</div>
          <div className="text-muted-foreground">{vendor.phone}</div>
        </div>
      );
    }
  },
  {
    id: 'location',
    header: 'Location',
    cell: ({ row }) => {
      const loc = row.original.location;
      return (
        <div className="flex flex-col gap-1 text-sm leading-tight lg:flex-row">
          {loc.area},{' '}
          <span className="text-muted-foreground">
            {loc.city}, {loc.state}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: 'lastRegistered',
    header: () => <div className="text-right">Last Registered</div>,
    cell: ({ row }) => {
      const dateStr = row.getValue('lastRegistered') as string;
      const date = new Date(dateStr);
      const formatted = format(date, 'yyyy-MM-dd');
      return <div className="text-right text-sm">{formatted}</div>;
    },
    filterFn: (row, id, value: DateRange | undefined) => {
      if (!value?.from || !value?.to) return true;
      const date = new Date(row.getValue(id) as string);
      return date >= value.from && date <= value.to;
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
          <DropdownMenuItem>Edit vendor</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Freeze vendor</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Remove vendor</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
];

export function VendorsList() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5
  });

  return (
    <div className="flex flex-col gap-3 p-3 lg:px-10">
      <h1 className="text-lg font-medium md:text-2xl">
        <strong>List</strong> of all the Vendors
      </h1>

      {/* Text filter and Date filter */}
      <div className="flex flex-col items-start gap-3 sm:flex-row">
        {/* Text filter */}
        <div className="flex flex-col items-start gap-5 pb-4">
          <Input
            placeholder="Filter by vendor name or email..."
            // Filtering logic should be handled inside DataTable if needed
            className="max-w-[550px] text-sm md:text-lg"
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
                  {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
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
                // Filtering logic should be handled inside DataTable if needed
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="gap-2 py-0">
        <DataTable
          columns={columns}
          data={SampleData}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      </div>
    </div>
  );
}
