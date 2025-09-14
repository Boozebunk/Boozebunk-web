'use client';

import * as React from 'react';

import { MoreHorizontal, Trash } from 'lucide-react';

import { Button } from '~/shared/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/shared/shadcn/dropdown-menu';
import { DataTable } from '~/shared/components/dataTable';

import type { ColumnDef } from '@tanstack/react-table';

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
  description: string;
  queryDate: string;
};

const data: Vendor[] = [
  {
    id: 'v1',
    martName: 'FreshBazaar',
    vendorName: 'Ravi Kumar',
    email: 'ravi.kumar@example.com',
    phone: '98765-12345',
    location: { area: 'Connaught Place', city: 'New Delhi', state: 'Delhi' },
    description:
      'We display a wide range of premium whiskey and wine, showing real-time stock availability for our customers. Note: We do not sell products directly; we only update inventory status.',
    queryDate: '2025-08-07T10:15:00Z'
  },
  {
    id: 'v2',
    martName: 'GreenMart',
    vendorName: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '98234-56789',
    location: { area: 'Bandra West', city: 'Mumbai', state: 'Maharashtra' },
    description:
      'Our store showcases the availability of various craft beers and spirits so that users can see stock levels at a glance. We do not sell the items ourselves.',
    queryDate: '2025-08-05T09:00:00Z'
  },
  {
    id: 'v3',
    martName: 'DailyFresh',
    vendorName: 'Amit Patel',
    email: 'amit.patel@example.com',
    phone: '99345-67890',
    location: { area: 'Navrangpura', city: 'Ahmedabad', state: 'Gujarat' },
    description:
      'High stock of popular vodka and rum brands displayed for customers. Only inventory info is provided; we are not a selling outlet.',
    queryDate: '2025-08-06T14:20:00Z'
  },
  {
    id: 'v4',
    martName: 'Annapurna Stores',
    vendorName: 'Sushma Reddy',
    email: 'sushma.reddy@example.com',
    phone: '98450-12345',
    location: { area: 'Banjara Hills', city: 'Hyderabad', state: 'Telangana' },
    description:
      'Displaying current stock of wines and liqueurs for users to check availability. We do not process any sales; it’s purely an information display.',
    queryDate: '2025-08-04T16:20:00Z'
  },
  {
    id: 'v5',
    martName: 'Namma Supermarket',
    vendorName: 'Karthik Iyer',
    email: 'karthik.iyer@example.com',
    phone: '98760-54321',
    location: { area: 'Indiranagar', city: 'Bengaluru', state: 'Karnataka' },
    description:
      'Showcasing high stock levels of local and imported spirits for customer reference. Note: We provide stock info only; no direct sales are conducted.',
    queryDate: '2025-08-03T11:15:00Z'
  }
];

const columns: ColumnDef<Vendor>[] = [
  {
    id: 'sno',
    header: () => <div className="text-center">S.No</div>,
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      return <div className="text-center">{pageIndex * pageSize + row.index + 1}</div>;
    },
    enableSorting: false
  },
  {
    accessorKey: 'martName',
    header: () => (
      <Button className="text-sm md:text-xl" variant="ghost">
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
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const desc = row.getValue('description') as string;
      return <div className="min-w-[250px] text-sm whitespace-normal">{desc || '—'}</div>;
    }
  },
  {
    id: 'location',
    header: 'Location',
    cell: ({ row }) => {
      const loc = row.original.location;
      return (
        <div className="flex flex-col gap-1 text-sm leading-tight">
          {loc.area},{' '}
          <span className="text-muted-foreground">
            {loc.city}, {loc.state}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: 'queryDate',
    header: () => <div className="text-right">Query Date</div>,
    cell: ({ row }) => {
      const dateStr = row.getValue('queryDate') as string;
      const date = new Date(dateStr);
      const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(date.getDate()).padStart(2, '0')}`;

      return <div className="text-right text-sm">{formatted}</div>;
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({}) => {
      // const query = row.original;
      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem variant="destructive">Delete Query</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    }
  }
];

export default function Page() {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10
  });

  return (
    <div className="flex flex-col gap-5 p-3 lg:px-10">
      <div className="flex items-center gap-5">
        <h1 className="text-lg font-medium md:text-2xl">
          <strong>Vendors</strong> Queries
        </h1>
        <div className="bg-foreground h-5 w-[1.5px]"></div>
        <Button variant={'ghost'} className="text-red-500">
          <Trash /> Delete all
        </Button>
      </div>

      <div className="gap-2 py-0">
        {/* Queries Table */}
        {/* {isLoading ? (
          <ComponentLoader />
        ) : ( */}
        <div className="gap-2 py-0">
          <DataTable
            columns={columns}
            data={data}
            pagination={pagination}
            onPaginationChange={setPagination}
            totalRowCount={data.length}
          />
        </div>
        {/* )} */}
      </div>
    </div>
  );
}
