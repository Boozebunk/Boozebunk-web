// import * as React from 'react';

// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getSortedRowModel,
//   useReactTable
// } from '@tanstack/react-table';
// import { ChevronDown } from 'lucide-react';

// import { Button } from '~/shared/shadcn/button';
// import { Card } from '~/shared/shadcn/card';
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger
// } from '~/shared/shadcn/dropdown-menu';
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious
// } from '~/shared/shadcn/pagination';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from '~/shared/shadcn/table';

// import type { Cell, ColumnDef, Row } from '@tanstack/react-table';

// type DataTableProps<TData> = {
//   columns: ColumnDef<TData>[];
//   data: TData[];
//   pagination: { pageIndex: number; pageSize: number };
//   onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
//   totalRowCount: number;
// };

// export function DataTable<TData>({
//   columns,
//   data,
//   pagination,
//   onPaginationChange,
//   totalRowCount
// }: DataTableProps<TData>) {
//   const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
//   const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});

//   // Calculate pageCount on the frontend
//   const pageCount = Math.ceil(totalRowCount / pagination.pageSize);

//   const table = useReactTable<TData>({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     onPaginationChange: (updaterOrValue) => {
//       const newPagination =
//         typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue;
//       onPaginationChange(newPagination);
//     },
//     state: {
//       columnVisibility,
//       rowSelection,
//       pagination
//     },
//     manualPagination: true,
//     pageCount: pageCount,
//     rowCount: totalRowCount
//   });

//   React.useEffect(() => {
//     const visibleRows = table.getRowModel().rows.length;
//     const currentIndex = table.getState().pagination.pageIndex ?? 0;

//     if (visibleRows === 0 && currentIndex !== 0 && totalRowCount > 0) {
//       table.setPageIndex(0);
//     }
//   }, [data, totalRowCount, table]);

//   return (
//     <>
//       {/* Column visibility dropdown */}
//       <div className="mb-2 flex items-center gap-5">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline">
//               Columns <ChevronDown />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             {table
//               .getAllColumns()
//               .filter((column) => column.getCanHide())
//               .map((column) => (
//                 <DropdownMenuCheckboxItem
//                   key={column.id}
//                   className="capitalize"
//                   checked={column.getIsVisible()}
//                   onCheckedChange={(value) => column.toggleVisibility(!!value)}>
//                   {column.id === 'vendorDetails'
//                     ? 'Vendor Details'
//                     : column.id === 'sno'
//                       ? 'S.No'
//                       : column.id}
//                 </DropdownMenuCheckboxItem>
//               ))}
//           </DropdownMenuContent>
//         </DropdownMenu>
//         {/* totalResults */}
//         <p className="text-sm font-semibold">
//           Total Results: <span className="font-medium">{totalRowCount}</span>
//         </p>
//       </div>
//       <Card className="overflow-hidden rounded-md border p-0 md:p-5">
//         <Table>
//           <TableHeader className="text-sm font-semibold md:text-xl">
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(header.column.columnDef.header, header.getContext())}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row: Row<TData>) => (
//                 <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
//                   {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
//                     <TableCell className="px-3 py-5 font-medium" key={cell.id}>
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="h-24 text-center">
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </Card>
//       <div className="flex justify-center py-4">
//         {/* <Pagination>
//           <PaginationContent>
//             <PaginationItem>
//               <PaginationPrevious
//                 onClick={() => table.previousPage()}
//                 aria-disabled={!table.getCanPreviousPage()}
//                 className={!table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : ''}
//               />
//             </PaginationItem>
//             {Array.from({ length: table.getPageCount() }).map((_, i) => (
//               <PaginationItem key={i}>
//                 <PaginationLink
//                   isActive={table.getState().pagination.pageIndex === i}
//                   onClick={() => table.setPageIndex(i)}>
//                   {i + 1}
//                 </PaginationLink>
//               </PaginationItem>
//             ))}
//             <PaginationItem>
//               <PaginationNext
//                 onClick={() => table.nextPage()}
//                 aria-disabled={!table.getCanNextPage()}
//                 className={!table.getCanNextPage() ? 'pointer-events-none opacity-50' : ''}
//               />
//             </PaginationItem>
//           </PaginationContent>
//         </Pagination> */}
//         <Pagination>
//           <PaginationContent>
//             {(() => {
//               const totalPages = table.getPageCount();
//               const current = table.getState().pagination.pageIndex;

//               if (totalPages === 0) return null;

//               const isMobile =
//                 typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;
//               const windowSize = isMobile ? 5 : 10;

//               // Compute group window (works for both small and large totals)
//               const group = Math.floor(current / windowSize);
//               const start = group * windowSize;
//               const end = Math.min(start + windowSize, totalPages);

//               const jumpTo = (page: number) => {
//                 const clamped = Math.max(0, Math.min(totalPages - 1, page));
//                 table.setPageIndex(clamped);
//               };

//               // Prev handler: prefer jumping one window back if possible, otherwise single-step
//               const handlePrev = () => {
//                 if (start > 0)
//                   jumpTo(start - 1); // group-jump backwards
//                 else jumpTo(current - 1); // single-step fallback
//               };

//               // Next handler: prefer jumping to next window start if possible, otherwise single-step
//               const handleNext = () => {
//                 if (end < totalPages)
//                   jumpTo(end); // group-jump forwards
//                 else jumpTo(current + 1); // single-step fallback
//               };

//               return (
//                 <>
//                   <PaginationItem>
//                     <PaginationPrevious
//                       onClick={handlePrev}
//                       aria-disabled={current === 0}
//                       className={`cursor-pointer ${current === 0 ? 'pointer-events-none opacity-50' : ''}`}
//                     />
//                   </PaginationItem>

//                   {/* If totalPages <= windowSize we still render all pages (start will be 0, end == totalPages) */}
//                   {Array.from({ length: end - start }).map((_, idx) => {
//                     const page = start + idx;
//                     return (
//                       <PaginationItem key={page}>
//                         <PaginationLink
//                           isActive={current === page}
//                           onClick={() => table.setPageIndex(page)}
//                           className="cursor-pointer">
//                           {page + 1}
//                         </PaginationLink>
//                       </PaginationItem>
//                     );
//                   })}

//                   <PaginationItem>
//                     <PaginationNext
//                       onClick={handleNext}
//                       aria-disabled={current === totalPages - 1}
//                       className={`cursor-pointer ${current === totalPages - 1 ? 'pointer-events-none opacity-50' : ''}`}
//                     />
//                   </PaginationItem>
//                 </>
//               );
//             })()}
//           </PaginationContent>
//         </Pagination>
//       </div>
//     </>
//   );
// }

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

import { useMediaQuery } from './mediaQuery';

import type { Cell, ColumnDef, Row, Table as TanStackTable } from '@tanstack/react-table';

type DataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  pagination: { pageIndex: number; pageSize: number };
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  totalRowCount: number;
};

export function useIsMobile() {
  return useMediaQuery('(max-width: 640px)');
}

// ----------------------------------------------------------------------
// 2. Pagination Component (Must be defined OUTSIDE the component)
// ----------------------------------------------------------------------
interface DataTablePaginationProps<TData> {
  table: TanStackTable<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const totalPages = table.getPageCount();
  const current = table.getState().pagination.pageIndex;

  const isMobile = useIsMobile();
  const windowSize = isMobile ? 5 : 10;

  if (totalPages === 0) return null;

  // Compute window for page numbers
  const group = Math.floor(current / windowSize);
  const start = group * windowSize;
  const end = Math.min(start + windowSize, totalPages);

  // Logic: Go to immediate previous page
  const handlePrev = () => {
    table.previousPage();
  };

  // Logic: Go to immediate next page
  const handleNext = () => {
    table.nextPage();
  };

  const canPrev = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrev}
            aria-disabled={!canPrev}
            className={`cursor-pointer ${!canPrev ? 'pointer-events-none opacity-50' : ''}`}
          />
        </PaginationItem>

        {Array.from({ length: end - start }).map((_, idx) => {
          const page = start + idx;
          return (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={current === page}
                onClick={() => table.setPageIndex(page)}
                className="cursor-pointer">
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            aria-disabled={!canNext}
            className={`cursor-pointer ${!canNext ? 'pointer-events-none opacity-50' : ''}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

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
    pageCount: pageCount,
    rowCount: totalRowCount
  });

  React.useEffect(() => {
    const visibleRows = table.getRowModel().rows.length;
    const currentIndex = table.getState().pagination.pageIndex ?? 0;

    if (visibleRows === 0 && currentIndex !== 0 && totalRowCount > 0) {
      table.setPageIndex(0);
    }
  }, [data, totalRowCount, table]);

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
        <DataTablePagination table={table} />
      </div>
    </>
  );
}
