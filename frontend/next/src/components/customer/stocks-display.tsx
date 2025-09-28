// import React from 'react';

// import { MapPin } from 'lucide-react';

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

// function StockDisplay(
//   { liquorItems, isLoadingItems, pagination, setPagination, totalPages }: StockDisplayProps,
//   ref: React.Ref<HTMLDivElement>
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
//           <div className="grid gap-5 sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] md:gap-10 lg:grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
//             {liquorItems.map((item, idx) => (
//               <ProductCard key={idx} info={item} />
//             ))}
//           </div>

//           {/* Pagination */}
//           <Pagination>
//             <PaginationContent>
//               <PaginationItem>
//                 <PaginationPrevious
//                   onClick={() =>
//                     setPagination({
//                       ...pagination,
//                       pageIndex: Math.max(0, pagination.pageIndex - 1)
//                     })
//                   }
//                   className={pagination.pageIndex === 0 ? 'pointer-events-none opacity-50' : ''}
//                 />
//               </PaginationItem>
//               {[...Array(totalPages)].map((_, idx) => (
//                 <PaginationItem key={idx}>
//                   <PaginationLink
//                     onClick={() => setPagination({ ...pagination, pageIndex: idx })}
//                     isActive={pagination.pageIndex === idx}>
//                     {idx + 1}
//                   </PaginationLink>
//                 </PaginationItem>
//               ))}
//               <PaginationItem>
//                 <PaginationNext
//                   onClick={() =>
//                     setPagination({
//                       ...pagination,
//                       pageIndex: Math.min(totalPages - 1, pagination.pageIndex + 1)
//                     })
//                   }
//                   className={
//                     pagination.pageIndex >= totalPages - 1 ? 'pointer-events-none opacity-50' : ''
//                   }
//                 />
//               </PaginationItem>
//             </PaginationContent>
//           </Pagination>
//         </>
//       )}
//     </div>
//   );
// }

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

import { useCustomerContext } from '~/providers/customer-provider';

import { ProductCard } from './product-card';

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

// Keep your function syntax but wrap with forwardRef
const StockDisplay = forwardRef<HTMLDivElement, StockDisplayProps>(function StockDisplay(
  { liquorItems, isLoadingItems, pagination, setPagination, totalPages },
  ref
) {
  const { selectedCity } = useCustomerContext();

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
              <WineOff className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
              <h2 className="sm:text-md mb-2 text-sm font-semibold md:text-lg">
                No Products Found
              </h2>
            </div>
          )}{' '}
          <div className="grid gap-5 sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] md:gap-10 lg:grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
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
        </>
      )}
    </div>
  );
});

export default StockDisplay;
