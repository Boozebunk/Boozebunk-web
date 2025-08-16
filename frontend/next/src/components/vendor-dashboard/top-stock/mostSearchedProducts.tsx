'use client';

import { Bar, BarChart, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/shadcn/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '~/shared/shadcn/chart';

import type { ChartConfig } from '~/shared/shadcn/chart';

export const description = 'Top liquor brands by search volume';

const chartData = [
  {
    brand: 'Jack Daniels',
    searches: 320,
    fill: 'color-mix(in srgb, var(--chart-1) 100%, transparent)'
  },
  {
    brand: 'Johnnie Walker',
    searches: 280,
    fill: 'color-mix(in srgb, var(--chart-1) 90%, transparent)'
  },
  { brand: 'Absolut', searches: 240, fill: 'color-mix(in srgb, var(--chart-1) 70%, transparent)' },
  {
    brand: 'Chivas Regal',
    searches: 200,
    fill: 'color-mix(in srgb, var(--chart-1) 60%, transparent)'
  },
  { brand: 'Bacardi', searches: 150, fill: 'color-mix(in srgb, var(--chart-1) 40%, transparent)' }
];

const chartConfig = {
  searches: {
    label: 'Searches',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig;

export function MostSearchedProducts() {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-sm md:text-xl">
          Top 5 Liquor Brands Customers Search For
        </CardTitle>
        <CardDescription className="text-xs">Based on data from the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[200px] w-full md:h-auto lg:aspect-[auto] lg:h-[300px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 0 }}
            barCategoryGap="50%"
            className="gap-0">
            <YAxis
              dataKey="brand"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis dataKey="searches" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="searches" layout="vertical" radius={5} barSize={40} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
