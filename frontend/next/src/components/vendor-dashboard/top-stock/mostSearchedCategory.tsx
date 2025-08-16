'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/shadcn/card';
import { Progress } from '~/shared/shadcn/progress';

const data = [
  { category: 'Whisky', percent: 42, color: 'var(--chart-1)' },
  { category: 'Vodka', percent: 28, color: 'var(--chart-2)' },
  { category: 'Wine', percent: 18, color: 'var(--chart-3)' },
  { category: 'Beer', percent: 12, color: 'var(--chart-4)' }
];

export function MostSearchedCategory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm md:text-xl">Search Trend By Category</CardTitle>
        <CardDescription className="text-xs">Based on data from the last 30 days</CardDescription>
      </CardHeader>
      <CardContent className="flex aspect-video h-[200px] flex-col justify-between md:h-full lg:h-[300px]">
        {data.map((item) => (
          <div key={item.category} className="flex flex-col">
            <div className="mb-1 flex justify-between">
              <span className="text-muted-foreground font-medium">{item.category}</span>
              <span className="text-muted-foreground font-medium">{item.percent}%</span>
            </div>
            <Progress value={item.percent} color={item.color} className="h-3" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
