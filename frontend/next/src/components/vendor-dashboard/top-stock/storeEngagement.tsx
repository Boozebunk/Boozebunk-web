'use client';

import { Loader2, MousePointerClick, Search } from 'lucide-react';

import { Badge } from '~/shared/shadcn/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/shadcn/card';

type StoreEngagementsProps = {
  viewCount: number;
  clickCount: number;
  isLoading: boolean;
};

export function StoreEngagement({ viewCount, clickCount, isLoading }: StoreEngagementsProps) {
  return (
    <Card className="gap-5">
      <CardHeader>
        <CardTitle className="text-sm md:text-xl">Store Engagement Overview</CardTitle>
        <CardDescription className="text-xs">
          Based on the over all data presented to you : boozebunk
        </CardDescription>
      </CardHeader>
      <CardContent className="grid aspect-video grid-cols-1 items-center justify-center gap-5 sm:grid-cols-2 md:h-full lg:h-[300px]">
        {/* Store Impressions */}
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="flex flex-col items-center gap-2">
            <Search className="h-8 w-8 text-blue-500" />
            <span className="text-base font-semibold">Store Impressions</span>
            <span className="text-muted-foreground text-xs lg:text-sm">
              Times your store is shown nearby
            </span>
          </div>
          <Badge className="rounded-lg bg-blue-100 px-5 py-2 text-xl font-bold text-blue-700">
            {isLoading ? <Loader2 /> : viewCount}
          </Badge>
        </div>

        {/* Store Clicks */}
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="flex flex-col items-center gap-2">
            <MousePointerClick className="h-8 w-8 text-green-500" />
            <span className="text-base font-semibold">Store Clicks</span>
            <span className="text-muted-foreground text-xs lg:text-sm">
              Times users clicked your store
            </span>
          </div>
          <Badge className="rounded-lg bg-green-100 px-5 py-2 text-xl font-bold text-green-700">
            {isLoading ? <Loader2 /> : clickCount}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
