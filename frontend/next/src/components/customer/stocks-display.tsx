// import React, { forwardRef } from 'react';

// import { MapPin, WineOff } from 'lucide-react';

// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious
// } from '~/shared/shadcn/pagination';

// import { useCustomerContext } from '~/providers/customer-provider';

// import { ProductCard } from './product-card';

// type StockDisplayProps = {
//   liquorItems: {
//     martName: string | null;
//     martStatus: string | null;
//     productName: string;
//     brandName: string;
//     category: string;
//     type: string | null;
//     price: string;
//     size: string;
//     productImageUrl: string | null;
//     martLat: number;
//     martLng: number;
//   }[];
//   isLoadingItems: boolean;
//   pagination: {
//     pageSize: number;
//     pageIndex: number;
//   };
//   setPagination: (val: { pageSize: number; pageIndex: number }) => void;
//   totalPages: number;
// };

// const StockDisplay = forwardRef<HTMLDivElement, StockDisplayProps>(function StockDisplay(
//   { liquorItems, isLoadingItems, pagination, setPagination, totalPages },
//   ref
// ) {
//   const { selectedCity } = useCustomerContext();

//   return (
//     <div ref={ref} className="flex w-full flex-col gap-5 px-5 md:gap-8 lg:px-25">
//       <div className="flex flex-col items-center gap-0 md:gap-1">
//         <h1 className="text-center text-2xl font-bold md:text-3xl">
//           Explore{' '}
//           <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
//             Stock
//           </span>
//         </h1>
//         <p className="text-center text-sm text-gray-500">Browse products curated for you.</p>
//       </div>

//       {isLoadingItems ? (
//         <div className="flex justify-center">Loading...</div>
//       ) : selectedCity === '' ? (
//         <div className="text-muted-foreground flex flex-col items-center gap-1 text-center text-sm font-medium sm:text-base">
//           <MapPin className="text-accent h-6 w-6 animate-bounce" />
//           <span>
//             Select your city to explore{' '}
//             <span className="text-accent font-semibold">what’s nearby!</span>
//           </span>
//         </div>
//       ) : (
//         <>
//           {liquorItems.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-5 text-center text-gray-500 dark:text-gray-400">
//               <WineOff className="mb-4 h-14 w-14 text-gray-300 sm:h-16 sm:w-16 dark:text-gray-600" />
//               <h2 className="text-md mb-2 font-semibold sm:text-lg">No Products Found</h2>
//             </div>
//           )}

//           <div className="grid grid-cols-1 justify-center gap-5 sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] md:gap-10 lg:grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
//             {liquorItems.map((item, idx) => (
//               <ProductCard key={idx} info={item} />
//             ))}
//           </div>

//           {/* Pagination */}
//           <Pagination key={pagination.pageIndex}>
//             <PaginationContent className="flex items-center gap-1">
//               {(() => {
//                 const totalItems = Number(totalPages) || 0;
//                 const pageSize = Math.max(1, Number(pagination.pageSize) || 1);
//                 const pages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);

//                 const isMobile =
//                   typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;
//                 const windowSize = isMobile ? 5 : 10;

//                 const current = Math.max(0, Math.min(pages - 1, pagination.pageIndex));

//                 const group = Math.floor(current / windowSize);
//                 const start = group * windowSize;
//                 const end = Math.min(start + windowSize - 1, pages - 1);

//                 const goTo = (page: number) => {
//                   const clamped = Math.max(0, Math.min(pages - 1, page));
//                   setPagination({ ...pagination, pageIndex: clamped });
//                 };

//                 const goPrevWindow = () => goTo(start - windowSize);
//                 const goNextWindow = () => goTo(start + windowSize);

//                 return (
//                   <>
//                     {/* Prev window */}
//                     <PaginationItem>
//                       <PaginationPrevious
//                         onClick={goPrevWindow}
//                         aria-disabled={start === 0}
//                         className={
//                           start === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
//                         }
//                       />
//                     </PaginationItem>

//                     {/* Page buttons horizontally */}
//                     {Array.from({ length: end - start + 1 }).map((_, i) => {
//                       const page = start + i;
//                       return (
//                         <PaginationItem key={page} className="cursor-pointer">
//                           <PaginationLink onClick={() => goTo(page)} isActive={page === current}>
//                             {page + 1}
//                           </PaginationLink>
//                         </PaginationItem>
//                       );
//                     })}

//                     {/* Next window */}
//                     <PaginationItem>
//                       <PaginationNext
//                         onClick={goNextWindow}
//                         aria-disabled={end >= pages - 1}
//                         className={
//                           end >= pages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
//                         }
//                       />
//                     </PaginationItem>
//                   </>
//                 );
//               })()}
//             </PaginationContent>
//           </Pagination>
//         </>
//       )}
//     </div>
//   );
// });

// export default StockDisplay;

import React, { forwardRef } from 'react';

import { MapPin, WineOff } from 'lucide-react';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '~/shared/shadcn/pagination';
import { useMediaQuery } from '~/shared/components/mediaQuery';

import { useCustomerContext } from '~/providers/customer-provider';

import { ProductCard } from './product-card';

export function useIsMobile() {
  return useMediaQuery('(max-width: 640px)');
}

type StockDisplayProps = {
  liquorItems: {
    martName: string | null;
    martStatus: string | null;
    productName: string;
    brandName: string;
    category: string;
    type: string | null;
    price: string;
    size: string;
    productImageUrl: string | null;
    martLat: number;
    martLng: number;
  }[];
  isLoadingItems: boolean;
  pagination: {
    pageSize: number;
    pageIndex: number;
  };
  setPagination: (val: { pageSize: number; pageIndex: number }) => void;
  totalPages: number;
};

const StockDisplay = forwardRef<HTMLDivElement, StockDisplayProps>(function StockDisplay(
  { liquorItems, isLoadingItems, pagination, setPagination, totalPages },
  ref
) {
  const { selectedCity } = useCustomerContext();

  const isMobile = useIsMobile();

  // --- Pagination Logic ---
  const totalItemCount = Number(totalPages) || 0;
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
    <div ref={ref} className="flex w-full flex-col gap-5 px-5 md:gap-8 lg:px-25">
      <div className="flex flex-col items-center gap-0 md:gap-1">
        <h1 className="text-center text-2xl font-bold md:text-3xl">
          Explore{' '}
          <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
            Stock
          </span>
        </h1>
        <p className="text-center text-sm text-gray-500">Browse products curated for you.</p>
      </div>

      {isLoadingItems ? (
        <div className="flex justify-center">Loading...</div>
      ) : selectedCity === '' ? (
        <div className="text-muted-foreground flex flex-col items-center gap-1 text-center text-sm font-medium sm:text-base">
          <MapPin className="text-accent h-6 w-6 animate-bounce" />
          <span>
            Select your city to explore{' '}
            <span className="text-accent font-semibold">what’s nearby!</span>
          </span>
        </div>
      ) : (
        <>
          {liquorItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-5 text-center text-gray-500 dark:text-gray-400">
              <WineOff className="mb-4 h-14 w-14 text-gray-300 sm:h-16 sm:w-16 dark:text-gray-600" />
              <h2 className="text-md mb-2 font-semibold sm:text-lg">No Products Found</h2>
            </div>
          )}

          <div className="grid grid-cols-1 justify-center gap-5 sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] md:gap-8 lg:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] lg:gap-10">
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
        </>
      )}
    </div>
  );
});

export default StockDisplay;
