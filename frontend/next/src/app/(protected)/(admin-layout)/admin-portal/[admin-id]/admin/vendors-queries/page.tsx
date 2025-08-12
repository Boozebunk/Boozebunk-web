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
import { ChevronDown } from 'lucide-react';

import { Button } from '~/shared/shadcn/button';
import { Card } from '~/shared/shadcn/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '~/shared/shadcn/dropdown-menu';
import { Input } from '~/shared/shadcn/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '~/shared/shadcn/pagination';
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
      'Need restock of apples and mangoes urgently iam very much satisfied with how well your platofrma has played a part in increasin the sales of the store by a bigh big marghin thanks to each of you guys for this fanatastic platofrm of yours.',
    queryDate: '2025-08-07T10:15:00Z'
  },
  {
    id: 'v2',
    martName: 'GreenMart',
    vendorName: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '98234-56789',
    location: { area: 'Bandra West', city: 'Mumbai', state: 'Maharashtra' },
    description: 'Looking for organic wheat supplier.',
    queryDate: '2025-08-05T09:00:00Z'
  },
  {
    id: 'v3',
    martName: 'DailyFresh',
    vendorName: 'Amit Patel',
    email: 'amit.patel@example.com',
    phone: '99345-67890',
    location: { area: 'Navrangpura', city: 'Ahmedabad', state: 'Gujarat' },
    description: 'Require bulk onions at wholesale price.',
    queryDate: '2025-08-06T14:20:00Z'
  },
  {
    id: 'v4',
    martName: 'Annapurna Stores',
    vendorName: 'Sushma Reddy',
    email: 'sushma.reddy@example.com',
    phone: '98450-12345',
    location: { area: 'Banjara Hills', city: 'Hyderabad', state: 'Telangana' },
    description: 'Requesting new vendor partnership details.',
    queryDate: '2025-08-04T16:20:00Z'
  },
  {
    id: 'v5',
    martName: 'Namma Supermarket',
    vendorName: 'Karthik Iyer',
    email: 'karthik.iyer@example.com',
    phone: '98760-54321',
    location: { area: 'Indiranagar', city: 'Bengaluru', state: 'Karnataka' },
    description: 'Need price list for dairy products.',
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
  }
];

export default function Page() {
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
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5
      }
    }
  });

  const pageCount = table.getPageCount();

  return (
    <div className="flex flex-col gap-2 p-3 sm:gap-3 lg:px-10">
      <h1 className="font-medium md:text-2xl">
        <strong>Vendors</strong> Queries
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

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => table.previousPage()}
                  className={!table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {Array.from({ length: pageCount }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    isActive={table.getState().pagination.pageIndex === index}
                    onClick={() => table.setPageIndex(index)}>
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => table.nextPage()}
                  className={!table.getCanNextPage() ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
