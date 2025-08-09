import React from 'react';

import { VendorsList } from '~/components/vendors-list/vendors-list-table';
import { VendorsOverview } from '~/components/vendors-list/vendorsOverview';

function page() {
  return (
    <div>
      <VendorsOverview />
      <VendorsList />
    </div>
  );
}

export default page;
