'use client';

import { useEffect, useState } from 'react';

import clsx from 'clsx';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/shared/shadcn/card';
import { Carousel, CarouselContent, CarouselItem } from '~/shared/shadcn/carousel';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '~/shared/shadcn/chart';

import type { ChartConfig } from '~/shared/shadcn/chart';

export const description = 'A radial chart with stacked sections';

const chartConfig: ChartConfig = {
  previous: {
    label: 'Previous',
    color: 'var(--chart-2)'
  },
  current: {
    label: 'Current',
    color: 'var(--chart-1)'
  }
};

const visitorStats = [
  {
    key: 'today',
    title: 'Daily Visitors',
    growth: '',
    description: 'Past 24 hours',
    note: 'from past 24 hours'
  },
  {
    key: 'week',
    title: 'Weekly Visitors',
    growth: '',
    description: 'Last 7 days',
    note: 'vs last week'
  },
  {
    key: 'month',
    title: 'Monthly Visitors',
    growth: '',
    description: 'Last 30 days',
    note: 'vs previous month'
  }
];

function calculateGrowth(previous: number, current: number) {
  if (previous === 0) return '100%';
  const growth = ((current - previous) / previous) * 100;
  return `${growth.toFixed(1)}%`;
}

const TrafficCard = ({
  stat,
  data
}: {
  stat: (typeof visitorStats)[number];
  data: { previous: number; current: number };
}) => {
  const totalVisitors = data.current;
  return (
    <Card className="flex h-[250px] w-[300px] flex-col gap-0 lg:h-[270px] lg:w-[calc(33.333%-1.25rem)]">
      <CardHeader className="items-center gap-0 pb-0">
        <CardTitle className="text-sm md:text-xl">{stat.title}</CardTitle>
        <CardDescription className="text-xs">{stat.description}</CardDescription>
      </CardHeader>

      <CardContent className="mt-[-15px] flex flex-1 items-center">
        <ChartContainer config={chartConfig} className="h-[150px] w-full">
          <RadialBarChart
            data={[{ previous: data.previous, current: data.current, total: totalVisitors }]}
            width={100}
            height={100}
            endAngle={180}
            innerRadius={60}
            outerRadius={100}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold">
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground">
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="current"
              fill="var(--color-current)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="previous"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-previous)"
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="mt-[-60px] flex-col gap-2 text-xs lg:text-sm">
        <p className="text-center leading-none font-medium">
          Increased by{' '}
          <em
            className={clsx(
              'rounded-s px-1 py-0.5',
              stat.growth.startsWith('-')
                ? 'bg-red-100 text-red-600'
                : 'bg-green-100 text-green-600'
            )}>
            {stat.growth}
          </em>{' '}
          {stat.note}
        </p>
        <div className="text-muted-foreground text-center text-[10px] leading-none sm:text-xs">
          Based on activity from the {stat.description.toLowerCase()}.
        </div>
      </CardFooter>
    </Card>
  );
};

export function Analytics() {
  const [analytics, setAnalytics] = useState<{
    today: { previous: number; current: number };
    week: { previous: number; current: number };
    month: { previous: number; current: number };
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setAnalytics({
          today: { previous: data.yesterday, current: data.today },
          week: { previous: data.lastWeek, current: data.week },
          month: { previous: data.lastMonth, current: data.month }
        });
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading)
    return (
      <div className="flex h-40 w-full items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg font-medium">Loading analytics...</span>
        </div>
      </div>
    );

  if (error || !analytics)
    return (
      <div className="flex h-40 w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <span className="text-lg font-medium">Failed to load analytics</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-red-100 px-3 py-1 text-sm font-medium">
            Refresh Page
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-2 p-3 sm:gap-3 lg:px-10">
      <h1 className="text-lg font-medium md:text-2xl">
        <strong>Website</strong> Traffic Overview
      </h1>
      <div className="hidden w-full flex-row justify-between gap-5 lg:flex">
        {visitorStats.map((stat, idx) => (
          <TrafficCard
            key={idx}
            stat={{
              ...stat,
              growth: calculateGrowth(
                analytics[stat.key as keyof typeof analytics].previous,
                analytics[stat.key as keyof typeof analytics].current
              )
            }}
            data={analytics[stat.key as keyof typeof analytics]}
          />
        ))}
      </div>

      <div className="block lg:hidden">
        <Carousel className="w-full">
          <CarouselContent className="gap-3">
            {visitorStats.map((stat, idx) => (
              <CarouselItem key={idx}>
                <TrafficCard
                  key={idx}
                  stat={stat}
                  data={analytics[stat.key as keyof typeof analytics]}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
