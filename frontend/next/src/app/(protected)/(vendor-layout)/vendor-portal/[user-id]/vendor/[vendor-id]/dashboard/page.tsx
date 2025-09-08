import { StockOverview } from '~/components/vendor-dashboard/stock-overview/StockOverview';
import { TopStock } from '~/components/vendor-dashboard/top-stock/topStockOverview';

export default function Page() {
  return (
    <div>
      <TopStock />
      <StockOverview />
    </div>
  );
}
