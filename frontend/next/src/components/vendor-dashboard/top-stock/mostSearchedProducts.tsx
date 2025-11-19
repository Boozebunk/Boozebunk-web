'use client';

import { Loader2 } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/shadcn/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '~/shared/shadcn/chart';

import type { ChartConfig } from '~/shared/shadcn/chart';

export const description = 'Top liquor brands by search volume';

const chartConfig = {
  searches: {
    label: 'Searches',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig;

type productsProps = {
  popularBrands?: {
    brandName: string;
    searchCount: number;
  }[];
  isLoading?: boolean;
};

export function MostSearchedProducts({ popularBrands = [], isLoading }: productsProps) {
  const chartData = popularBrands.map((brand, index) => ({
    brand: brand.brandName,
    searches: brand.searchCount,
    fill: `color-mix(in srgb, var(--chart-1) ${100 - index * 20}%, transparent)`
  }));

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-sm md:text-xl">
          Top 5 Liquor Brands Customers Search For
        </CardTitle>
        <CardDescription className="text-xs">Based on data from the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loader2 />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-[200px] w-full md:h-auto lg:aspect-[auto] lg:h-[300px]">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{ left: 0 }}
              barCategoryGap="50%">
              <YAxis
                dataKey="brand"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={100}
              />
              <XAxis dataKey="searches" type="number" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="searches" layout="vertical" radius={5} barSize={40} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
