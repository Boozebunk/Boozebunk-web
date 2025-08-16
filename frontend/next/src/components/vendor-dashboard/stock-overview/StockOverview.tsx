import { LowStock } from './lowStock';
import { OutOfStock } from './outOfStock';
import { TotalStock } from './totalStock';

export function StockOverview() {
  return (
    <div className="flex flex-col gap-2 p-3 sm:gap-3 lg:px-10">
      <h1 className="font-medium md:text-2xl">
        <strong>Stock</strong> Overview
      </h1>

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-[3fr_5fr] lg:grid-cols-[1fr_2fr_2fr]">
        {' '}
        <TotalStock />
        <LowStock />
        <OutOfStock />
      </div>
    </div>
  );
}
