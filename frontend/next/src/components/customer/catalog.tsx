import React, { forwardRef } from 'react';

import { WineOff } from 'lucide-react';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '~/shared/shadcn/pagination';

import { ProductCard } from './product-card';

type CatalogDisplayProps = {
  liquorItems: {
    id: string;
    brandName: string;
    productName: string;
    category: string;
    type: string | null;
    size: string;
    price: string;
  }[];
  pagination: {
    pageSize: number;
    pageIndex: number;
  };
  setPagination: (val: { pageSize: number; pageIndex: number }) => void;
  totalPages: number;
};

const CatalogDisplay = forwardRef<HTMLDivElement, CatalogDisplayProps>(function StockDisplay(
  { liquorItems, pagination, setPagination, totalPages },
  ref
) {
  return (
    <div ref={ref} className="flex w-full flex-col gap-8 px-5 md:gap-10 lg:px-25">
      {liquorItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-5 text-center text-gray-500 dark:text-gray-400">
          <WineOff className="mb-4 h-14 w-14 text-gray-300 sm:h-16 sm:w-16 dark:text-gray-600" />
          <h2 className="text-md mb-2 font-semibold sm:text-lg">No Products Found</h2>
        </div>
      )}

      <div className="grid grid-cols-1 justify-center gap-5 sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] md:gap-10 lg:grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
        {liquorItems.map((item, idx) => (
          <ProductCard key={idx} info={item} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                setPagination({
                  ...pagination,
                  pageIndex: Math.max(0, pagination.pageIndex - 1)
                })
              }
              className={pagination.pageIndex === 0 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, idx) => (
            <PaginationItem key={idx}>
              <PaginationLink
                onClick={() => setPagination({ ...pagination, pageIndex: idx })}
                isActive={pagination.pageIndex === idx}>
                {idx + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setPagination({
                  ...pagination,
                  pageIndex: Math.min(totalPages - 1, pagination.pageIndex + 1)
                })
              }
              className={
                pagination.pageIndex >= totalPages - 1 ? 'pointer-events-none opacity-50' : ''
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
});

export default CatalogDisplay;
