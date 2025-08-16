import React from 'react';

import { VendorsList } from '~/components/admin-dashboard/vendors-list/vendors-list-table';
import { VendorsOverview } from '~/components/admin-dashboard/vendors-list/vendorsOverview';

function page() {
  return (
    <div>
      <VendorsOverview />
      <VendorsList />
    </div>
  );
}

export default page;
