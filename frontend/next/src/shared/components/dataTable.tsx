// frontend/next/src/shared/components/data-table.tsx

import * as React from 'react';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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

import type { Cell, ColumnDef, Row } from '@tanstack/react-table';

type DataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  pagination: { pageIndex: number; pageSize: number };
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  totalRowCount: number; // NEW: Only totalRowCount is needed from backend
};

export function DataTable<TData>({
  columns,
  data,
  pagination,
  onPaginationChange,
  totalRowCount
}: DataTableProps<TData>) {
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});

  // Calculate pageCount on the frontend
  const pageCount = Math.ceil(totalRowCount / pagination.pageSize);

  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updaterOrValue) => {
      const newPagination =
        typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue;
      onPaginationChange(newPagination);
    },
    state: {
      columnVisibility,
      rowSelection,
      pagination
    },
    manualPagination: true,
    pageCount: pageCount, // Use the frontend-calculated pageCount
    rowCount: totalRowCount // Provide totalRowCount
  });

  return (
    <>
      {/* Column visibility dropdown */}
      <div className="mb-2 flex items-center gap-5">
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
              .map((column) => (
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
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* totalResults */}
        <p className="text-sm font-semibold">
          Total Results: <span className="font-medium">{totalRowCount}</span>
        </p>
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
              table.getRowModel().rows.map((row: Row<TData>) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
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
    </>
  );
}
