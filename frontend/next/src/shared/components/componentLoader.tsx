import React from 'react';

import { Loader2 } from 'lucide-react';

export function ComponentLoader() {
  return (
    <div>
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
        <h1>Fetching Data...</h1>
      </div>
    </div>
  );
}
