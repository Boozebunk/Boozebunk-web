import { MostSearchedCategory } from './mostSearchedCategory';
import { MostSearchedProducts } from './mostSearchedProducts';

export function TopStock() {
  return (
    <div className="flex flex-col gap-2 p-3 sm:gap-3 lg:px-10">
      <h1 className="font-medium md:text-2xl">
        <strong>Users</strong> Search Overview
      </h1>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-5">
        <MostSearchedProducts />
        <MostSearchedCategory />
      </div>
    </div>
  );
}
