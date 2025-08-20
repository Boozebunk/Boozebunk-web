import { Boxes, ChevronRight, PackagePlus } from 'lucide-react';

import { Button } from '~/shared/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/shared/shadcn/card';

import { StoreStatus } from './storeStatus';

export async function QuickActionsPanel() {
  return (
    <Card className="flex w-full items-center gap-5 p-5 px-5 sm:gap-10 md:col-span-2 lg:col-span-1">
      <CardHeader className="w-full p-0 text-center">
        <CardTitle className="text-sm sm:text-xl">Quick Actions</CardTitle>
      </CardHeader>

      <CardContent className="flex w-full flex-col gap-5 p-0">
        <StoreStatus />
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <Button className="flex flex-1 items-center gap-2">
            Update stock <Boxes /> <ChevronRight />
          </Button>
          <Button className="flex flex-1 items-center gap-2">
            Add new product <PackagePlus /> <ChevronRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
