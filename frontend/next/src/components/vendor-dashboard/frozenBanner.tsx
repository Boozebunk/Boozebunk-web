import React from 'react';

import { Snowflake } from 'lucide-react';

function FrozenBanner() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-100 p-6 text-center">
      <Snowflake className="mb-4 h-12 w-12 animate-pulse text-blue-500" />

      <h1 className="mb-2 text-3xl font-bold text-blue-900">Account Frozen</h1>

      <p className="mb-6 max-w-md text-blue-800">
        Your vendor account has been temporarily frozen. Please contact the admin to unfreeze your
        access. Meanwhile, you can still send a query to the admin.
      </p>

      <div className="mt-8 text-sm text-blue-700/70 italic">
        — Team <strong>BoozeBunk</strong>
      </div>
    </div>
  );
}

export default FrozenBanner;
