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
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown, MoreHorizontal } from 'lucide-react';

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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '~/shared/shadcn/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '~/shared/shadcn/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/shared/shadcn/table';
import { ToggleGroup, ToggleGroupItem } from '~/shared/shadcn/toggle-group';

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState
} from '@tanstack/react-table';
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
const baseActive: Vendor[] = [
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

const activeVendors: Vendor[] = Array.from({ length: 5 }, (_, i) =>
  baseActive.map((v) => ({
    ...v,
    id: `${v.id}-${i + 1}`
  }))
).flat();

const baseFrozen: Vendor[] = [
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
  }
];

const frozenVendors: Vendor[] = Array.from({ length: 5 }, (_, i) =>
  baseFrozen.map((v) => ({
    ...v,
    id: `${v.id}-${i + 1}`
  }))
).flat();

// Columns
const getColumns = (isFrozen: boolean): ColumnDef<Vendor>[] => [
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
          {isFrozen ? (
            <DropdownMenuItem>Restore Vendor</DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem>Edit vendor</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Freeze vendor</DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem asChild>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="mt-1" variant="destructive">
                  Remove vendor
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to remove this vendor?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently remove the vendor from the
                    platform.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
];

export function VendorsList() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isFrozen, setIsFrozen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);

  const data = isFrozen ? frozenVendors : activeVendors;

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5
  });

  const table = useReactTable({
    data,
    columns: getColumns(isFrozen),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    }
  });

  return (
    <div className="flex flex-col gap-3 p-3 lg:px-10">
      <h1 className="text-lg font-medium md:text-2xl">
        <strong>List</strong> of all the Vendors
      </h1>

      {/* Date Range Filter */}
      <div className="flex flex-col items-start gap-3 sm:flex-row">
        {/* Toggle for Active/Frozen */}
        <ToggleGroup
          type="single"
          value={isFrozen ? 'frozen' : 'active'}
          onValueChange={(val) => {
            if (val) setIsFrozen(val === 'frozen');
          }}
          className="bg-background w-fit">
          <ToggleGroupItem value="active" aria-label="Active Vendors">
            Active Vendors
          </ToggleGroupItem>
          <ToggleGroupItem value="frozen" aria-label="Frozen Vendors">
            Frozen Vendors
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="flex items-start gap-5">
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
                  table.getColumn('lastRegistered')?.setFilterValue(range || undefined);
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Column visibility dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
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
                      {column.id === 'vendorDetails'
                        ? 'Vendor Details'
                        : column.id === 'sno'
                          ? 'S.No'
                          : column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-3 gap-2 py-0">
        {/* Text filter */}
        <Input
          placeholder="Filter by vendor name or email..."
          value={(table.getColumn('vendorDetails')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('vendorDetails')?.setFilterValue(event.target.value)}
          className="mb-3 max-w-[550px] text-sm md:text-lg"
        />

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
                  <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        <div className="flex justify-center py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => table.previousPage()}
                  aria-disabled={!table.getCanPreviousPage()}
                  className={!table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {Array.from({ length: table.getPageCount() }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={table.getState().pagination.pageIndex === i}
                    onClick={() => table.setPageIndex(i)}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => table.nextPage()}
                  aria-disabled={!table.getCanNextPage()}
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
