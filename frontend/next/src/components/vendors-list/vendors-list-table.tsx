'use client';

import * as React from 'react';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { ChevronDown, MoreHorizontal } from 'lucide-react';

import { Button } from '~/shared/shadcn/button';
import { Card } from '~/shared/shadcn/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/shared/shadcn/dropdown-menu';
import { Input } from '~/shared/shadcn/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/shared/shadcn/table';

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState
} from '@tanstack/react-table';

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

const data: Vendor[] = [
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
  },
  {
    id: 'v3',
    martName: 'DailyFresh',
    vendorName: 'Amit Patel',
    email: 'amit.patel@example.com',
    phone: '99345-67890',
    location: {
      area: 'Navrangpura',
      city: 'Ahmedabad',
      state: 'Gujarat'
    },
    lastRegistered: '2024-02-05T09:45:00Z'
  },
  {
    id: 'v4',
    martName: 'Annapurna Stores',
    vendorName: 'Sushma Reddy',
    email: 'sushma.reddy@example.com',
    phone: '98450-12345',
    location: {
      area: 'Banjara Hills',
      city: 'Hyderabad',
      state: 'Telangana'
    },
    lastRegistered: '2024-03-12T16:20:00Z'
  },
  {
    id: 'v5',
    martName: 'Namma Supermarket',
    vendorName: 'Karthik Iyer',
    email: 'karthik.iyer@example.com',
    phone: '98760-54321',
    location: {
      area: 'Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka'
    },
    lastRegistered: '2024-04-01T11:15:00Z'
  }
];

export const columns: ColumnDef<Vendor>[] = [
  {
    accessorKey: 'martName',
    header: () => (
      <Button
        className="text-sm md:text-xl"
        variant="ghost"
        onClick={
          (
            {
              // currentTarget
            }
          ) => {} /* no sorting on this for now */
        }>
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
      const formatted = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      return <div className="text-right text-sm">{formatted}</div>;
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: (
      {
        // row
      }
    ) => {
      //   const vendor = row.original;

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
            <DropdownMenuItem className="mt-2">Freeze vendor</DropdownMenuItem>
            <DropdownMenuItem className="mt-2" variant="destructive">
              Remove vendor
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];

export function VendorsList() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  });

  return (
    <div className="flex flex-col gap-2 p-3 sm:gap-3 lg:px-10">
      <h1 className="font-medium md:text-2xl">
        <strong>List</strong> of all the Vendors
      </h1>
      <div className="gap-2 py-0">
        <div className="flex items-center gap-3 pb-4 lg:gap-[50%]">
          <Input
            placeholder="Filter by vendor name or email..."
            value={(table.getColumn('vendorName')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('vendorName')?.setFilterValue(event.target.value)}
            className="max-w-[100%] text-sm md:text-lg"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                      {column.id === 'vendorDetails' ? 'Vendor Details' : column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Card className="overflow-hidden rounded-md border p-0 md:p-5">
          <Table>
            <TableHeader className="text-sm font-semibold md:text-xl">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className="px-3 py-5 font-medium" key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
        <div className="flex items-center justify-end space-x-2 py-4">
          {/* <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div> */}
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </div>{' '}
    </div>
  );
}
