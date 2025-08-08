import { Analytics } from '~/components/admin-dashboard/analytics';
import { TopVendors } from '~/components/admin-dashboard/topVendors';
import { VendorsActivity } from '~/components/admin-dashboard/vendorsActivity';

export default function Page() {
  return (
    <div>
      <Analytics />
      <VendorsActivity />
      <TopVendors />
    </div>
  );
}
