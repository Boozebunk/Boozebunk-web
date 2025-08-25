import React from 'react';

import { Loader2 } from 'lucide-react';

export function PageLoader() {
  return (
    <div>
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Loader2 className="text-primary h-15 w-15 animate-spin" />
        <h1>boozebunk...</h1>
      </div>
    </div>
  );
}
