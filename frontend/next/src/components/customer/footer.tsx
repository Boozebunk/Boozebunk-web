import React from 'react';

import { AlertTriangle } from 'lucide-react';

function CustomerFooter() {
  return (
    <footer className="border-foreground/20 mt-5 flex w-full flex-col gap-5 border-t py-10">
      <div className="text-muted-foreground mx-auto max-w-6xl space-y-4 px-4 text-center text-xs sm:text-sm">
        <p className="text-foreground flex items-center justify-center gap-2 font-semibold tracking-wide uppercase">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Responsible Consumption Notice
        </p>

        <p>
          We do not promote or encourage excessive drinking. Alcohol consumption is strictly for
          individuals of legal drinking age.
        </p>

        <p>
          Please drink responsibly and at your own risk. Know your limits, and never drink and
          drive.
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 text-xs sm:text-sm">
        <span>Copyright © 2025 Boozebunk. All Right Reserved.</span>
      </div>
    </footer>
  );
}

export default CustomerFooter;
