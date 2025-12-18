// import React, { forwardRef } from 'react';

// import { WineOff } from 'lucide-react';

// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious
// } from '~/shared/shadcn/pagination';

// import { ProductCard } from './product-card';

// type CatalogDisplayProps = {
//   liquorItems: {
//     id: string;
//     brandName: string;
//     productName: string;
//     category: string;
//     type: string | null;
//     size: string;
//     price: string;
//     productImageUrl: string | null;
//   }[];
//   pagination: {
//     pageSize: number;
//     pageIndex: number;
//   };
//   setPagination: (val: { pageSize: number; pageIndex: number }) => void;
//   totalPages: number;
// };

// const CatalogDisplay = forwardRef<HTMLDivElement, CatalogDisplayProps>(function StockDisplay(
//   { liquorItems, pagination, setPagination, totalPages },
//   ref
// ) {
//   return (
//     <div ref={ref} className="flex w-full flex-col gap-8 px-5 md:gap-10 lg:px-25">
//       {liquorItems.length === 0 && (
//         <div className="flex flex-col items-center justify-center py-5 text-center text-gray-500 dark:text-gray-400">
//           <WineOff className="mb-4 h-14 w-14 text-gray-300 sm:h-16 sm:w-16 dark:text-gray-600" />
//           <h2 className="text-md mb-2 font-semibold sm:text-lg">No Products Found</h2>
//         </div>
//       )}

//       <div className="grid grid-cols-1 justify-center gap-5 sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] md:gap-10 lg:grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
//         {liquorItems.map((item, idx) => (
//           <ProductCard key={idx} info={item} />
//         ))}
//       </div>

//       {/* Pagination */}
//       <Pagination>
//         <PaginationContent>
//           <PaginationItem>
//             <PaginationPrevious
//               onClick={() =>
//                 setPagination({
//                   ...pagination,
//                   pageIndex: Math.max(0, pagination.pageIndex - 1)
//                 })
//               }
//               className={pagination.pageIndex === 0 ? 'pointer-events-none opacity-50' : ''}
//             />
//           </PaginationItem>
//           {[...Array(totalPages)].map((_, idx) => (
//             <PaginationItem key={idx}>
//               <PaginationLink
//                 onClick={() => setPagination({ ...pagination, pageIndex: idx })}
//                 isActive={pagination.pageIndex === idx}>
//                 {idx + 1}
//               </PaginationLink>
//             </PaginationItem>
//           ))}
//           <PaginationItem>
//             <PaginationNext
//               onClick={() =>
//                 setPagination({
//                   ...pagination,
//                   pageIndex: Math.min(totalPages - 1, pagination.pageIndex + 1)
//                 })
//               }
//               className={
//                 pagination.pageIndex >= totalPages - 1 ? 'pointer-events-none opacity-50' : ''
//               }
//             />
//           </PaginationItem>
//         </PaginationContent>
//       </Pagination>
//     </div>
//   );
// });

// export default CatalogDisplay;

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
import { useMediaQuery } from '~/shared/components/mediaQuery';

import { ProductCard } from './product-card';

export function useIsMobile() {
  return useMediaQuery('(max-width: 640px)');
}

type CatalogDisplayProps = {
  liquorItems: {
    id: string;
    brandName: string;
    productName: string;
    category: string;
    type: string | null;
    size: string;
    price: string;
    productImageUrl: string | null;
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
  const isMobile = useIsMobile();

  // --- Pagination Logic ---
  const totalItemCount = Number(totalPages) || 0;

  React.useEffect(() => {
    const visibleRows = liquorItems.length;
    const currentIndex = pagination.pageIndex;

    // Check if we have no visible items, aren't on page 0, but do have actual data in the DB
    if (visibleRows === 0 && currentIndex !== 0 && totalItemCount > 0) {
      setPagination({ ...pagination, pageIndex: 0 });
    }
  }, [liquorItems, pagination, setPagination, totalItemCount]);

  const pageSize = Math.max(1, Number(pagination.pageSize) || 1);
  const pageCount = Math.ceil(totalItemCount / pageSize);
  const current = pagination.pageIndex;

  const windowSize = isMobile ? 5 : 10;

  // Calculate window for page numbers
  const group = Math.floor(current / windowSize);
  const start = group * windowSize;
  const end = Math.min(start + windowSize, pageCount);

  const canPrev = current > 0;
  const canNext = current < pageCount - 1;

  const handlePrev = () => {
    if (canPrev) {
      setPagination({ ...pagination, pageIndex: current - 1 });
    }
  };

  const handleNext = () => {
    if (canNext) {
      setPagination({ ...pagination, pageIndex: current + 1 });
    }
  };

  const handleGoToPage = (page: number) => {
    setPagination({ ...pagination, pageIndex: page });
  };

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
      {pageCount > 0 && (
        <div className="flex justify-center py-4">
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
                      onClick={() => handleGoToPage(page)}
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
        </div>
      )}
    </div>
  );
});

export default CatalogDisplay;
