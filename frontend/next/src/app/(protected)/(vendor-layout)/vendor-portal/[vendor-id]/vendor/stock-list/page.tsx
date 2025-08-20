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
import { ChevronDown, MoreHorizontal, Pencil } from 'lucide-react';

import { Button } from '~/shared/shadcn/button';
import { Card } from '~/shared/shadcn/card';
import { Checkbox } from '~/shared/shadcn/checkbox';
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
  { id: 1, stockName: "Jack Daniel's", size: '750ml', category: 'Whiskey' },
  { id: 2, stockName: 'Grey Goose', size: '1L', category: 'Vodka' },
  { id: 3, stockName: 'Johnnie Walker Black', size: '750ml', category: 'Whiskey' },
  { id: 4, stockName: 'Bombay Sapphire', size: '1L', category: 'Gin' }
];

type StockItem = {
  category: string;
  id: number;
  stockName: string;
  size: string;
};

export default function Page() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Availability keyed by item ID (default = 'out')
  const [rowAvailability, setRowAvailability] = React.useState<Record<number, 'in' | 'out'>>(() =>
    stockItems.reduce(
      (acc, item) => {
        acc[item.id] = 'out';
        return acc;
      },
      {} as Record<number, 'in' | 'out'>
    )
  );

  // Stock filter toggle
  const [stockFilter, setStockFilter] = React.useState<'all' | 'in' | 'out'>('all');

  // Add this state along with stockFilter
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');

  // Get unique categories dynamically
  const categories = React.useMemo(
    () => ['all', ...Array.from(new Set(stockItems.map((item) => item.category)))],
    []
  );

  const filteredStockItems = React.useMemo(() => {
    return stockItems.filter((item) => {
      const matchesAvailability = stockFilter === 'all' || rowAvailability[item.id] === stockFilter;
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchesAvailability && matchesCategory;
    });
  }, [stockFilter, categoryFilter, rowAvailability]);

  const columns: ColumnDef<StockItem>[] = [
    {
      id: 'select_sno',
      header: ({ table }) => (
        <div className="mr-5 flex items-center gap-2 font-medium">
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
            <span className="text-sm font-medium sm:text-lg">{item.stockName}</span>
            <span className="text-muted-foreground text-xs md:text-sm">{item.size}</span>
          </div>
        );
      }
    },
    {
      id: 'Category',
      header: 'Category',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex flex-col">
            <span className="text-sm font-normal sm:text-lg">{item.category}</span>{' '}
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
              value={rowAvailability[item.id]}
              onValueChange={(value) =>
                setRowAvailability((prev) => ({ ...prev, [item.id]: value as 'in' | 'out' }))
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

  const table = useReactTable({
    data: filteredStockItems,
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

          <div className="flex items-start gap-5">
            {/* NEW Category filter dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <strong>Category:</strong>&nbsp;
                  {categoryFilter === 'all' ? 'All' : categoryFilter} <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat} onClick={() => setCategoryFilter(cat)}>
                    {cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

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
                        {column.id === 'select_sno'
                          ? 'S.No'
                          : column.id === 'stockDetails'
                            ? 'Stock Details'
                            : column.id === 'Category'
                              ? 'Category'
                              : column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Button
            className="w-fit bg-green-600 text-white"
            disabled={Object.keys(rowSelection).length === 0}
            onClick={() => {
              const selectedRows = Object.keys(rowSelection)
                .map((key) => {
                  const row = table.getRowModel().rows.find((r) => r.id === key);
                  if (!row) return null;
                  const itemId = (row.original as StockItem).id;
                  return {
                    id: itemId,
                    availability: rowAvailability[itemId]
                  };
                })
                .filter(Boolean);
              console.log('Updating availability for:', selectedRows);
              // TODO: send selectedRows to backend
            }}>
            Update to In-Stock
          </Button>

          <Button
            className="w-fit bg-red-600 text-white"
            disabled={Object.keys(rowSelection).length === 0}
            onClick={() => {
              const selectedRows = Object.keys(rowSelection)
                .map((key) => {
                  const row = table.getRowModel().rows.find((r) => r.id === key);
                  if (!row) return null;
                  const itemId = (row.original as StockItem).id;
                  return {
                    id: itemId,
                    availability: rowAvailability[itemId]
                  };
                })
                .filter(Boolean);
              console.log('Updating availability for:', selectedRows);
              // TODO: send selectedRows to backend
            }}>
            Update to Out-0f-Stock
          </Button>
        </div>
      </div>

      <div className="mt-3 gap-2 py-0">
        <Input
          placeholder="Search by stock name..."
          value={(table.getColumn('stockDetails')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('stockDetails')?.setFilterValue(event.target.value)}
          className="mb-3 max-w-[100%] text-sm sm:w-[50%] md:text-lg"
        />

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
