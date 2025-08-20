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

import { Button } from '~/shared/shadcn/button';
import { Card } from '~/shared/shadcn/card';
import { Checkbox } from '~/shared/shadcn/checkbox';
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
import { ToggleGroup, ToggleGroupItem } from '~/shared/shadcn/toggle-group';

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState
} from '@tanstack/react-table';

const stockItems = [
  { stockName: "Jack Daniel's", size: '750ml' },
  { stockName: 'Grey Goose', size: '1L' },
  { stockName: 'Johnnie Walker Black', size: '750ml' },
  { stockName: 'Bombay Sapphire', size: '1L' }
];

type StockItem = {
  stockName: string;
  size: string;
};

export default function Page() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [rowAvailability, setRowAvailability] = React.useState<Record<string, 'in' | 'out'>>(() =>
    stockItems.reduce(
      (acc, _, idx) => {
        acc[idx] = 'out'; // default availability
        return acc;
      },
      {} as Record<string, 'in' | 'out'>
    )
  );

  const columns: ColumnDef<StockItem>[] = [
    {
      id: 'select_sno',
      header: ({ table }) => (
        <div className="mr-5 flex items-center gap-2">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                  ? 'indeterminate'
                  : false
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
          <span>Edit All</span>
        </div>
      ),
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        const sno = pageIndex * pageSize + row.index + 1;

        return (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
            <span>{sno}</span>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false
    },
    {
      id: 'stockDetails',
      header: 'Stock Details',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex flex-col">
            <span className="text-sm sm:font-medium">{item.stockName}</span>
            <span className="text-muted-foreground text-xs md:text-sm">{item.size}</span>
          </div>
        );
      }
    },
    {
      id: 'availability',
      header: () => <div className="text-right">Availability</div>, // Align header text to right
      cell: ({ row }) => (
        <div className="flex justify-end">
          <ToggleGroup
            type="single"
            value={rowAvailability[row.index]}
            onValueChange={(value) =>
              setRowAvailability((prev) => ({ ...prev, [row.index]: value as 'in' | 'out' }))
            }
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
      )
    }
  ];

  const table = useReactTable({
    data: stockItems,
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
        <strong>Out</strong> of Stock Products
      </h1>
      <div className="gap-2 py-0">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            className="w-fit bg-green-600 text-white"
            disabled={Object.keys(rowSelection).length === 0}
            onClick={() => {
              const selectedRows = Object.keys(rowSelection).map((key) => ({
                index: parseInt(key),
                availability: rowAvailability[parseInt(key)]
              }));
              console.log('Updating availability for:', selectedRows);
              // TODO: send selectedRows to backend for update
            }}>
            Update to In-Stock
          </Button>

          <Input
            placeholder="Search by stock name..."
            value={(table.getColumn('stockDetails')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('stockDetails')?.setFilterValue(event.target.value)
            }
            className="max-w-[100%] text-sm sm:w-[50%] md:text-lg"
          />
        </div>

        <Card className="overflow-hidden rounded-md border p-0 md:p-5">
          <Table>
            <TableHeader className="text-sm font-semibold md:text-xl">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
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
