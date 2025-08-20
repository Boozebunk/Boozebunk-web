'use client';

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

const generateChartData = () => [
  {
    label: 'visitors',
    desktop: Math.floor(Math.random() * 3000) + 1000,
    mobile: Math.floor(Math.random() * 2000) + 500
  }
];

const chartConfig: ChartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-2)'
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-1)'
  }
};

const visitorStats = [
  {
    title: 'Daily Visitors',
    description: 'Past 24 hours',
    growth: '5.2%',
    note: 'from past 24 hours'
  },
  {
    title: 'Weekly Visitors',
    description: 'Last 7 days',
    growth: '12.8%',
    note: 'vs last week'
  },
  {
    title: 'Monthly Visitors',
    description: 'Last 30 days',
    growth: '21.4%',
    note: 'vs previous month'
  }
];

const TrafficCard = ({ stat }: { stat: (typeof visitorStats)[number] }) => {
  const chartData = generateChartData();
  const totalVisitors = chartData[0].desktop + chartData[0].mobile;

  return (
    <Card className="flex h-[250px] w-[300px] flex-col gap-0 lg:h-[270px] lg:w-[calc(33.333%-1.25rem)]">
      <CardHeader className="items-center gap-0 pb-0">
        <CardTitle className="text-sm md:text-xl">{stat.title}</CardTitle>
        <CardDescription className="text-xs">{stat.description}</CardDescription>
      </CardHeader>

      <CardContent className="mt-[-15px] flex flex-1 items-center">
        <ChartContainer config={chartConfig} className="h-[150px] w-full">
          <RadialBarChart
            data={chartData}
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
              dataKey="desktop"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-desktop)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="mobile"
              fill="var(--color-mobile)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="mt-[-60px] flex-col gap-2 text-xs lg:text-sm">
        <p className="text-center leading-none font-medium">
          Increased by{' '}
          <em className="rounded-sm bg-green-100 px-1 py-0.5 text-green-600">{stat.growth}</em>{' '}
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
  return (
    <div className="flex flex-col gap-2 p-3 sm:gap-3 lg:px-10">
      <h1 className="text-lg font-medium md:text-2xl">
        <strong>Website</strong> Traffic Overview
      </h1>
      <div className="hidden w-full flex-row justify-between gap-5 lg:flex">
        {visitorStats.map((stat, idx) => (
          <TrafficCard key={idx} stat={stat} />
        ))}
      </div>

      <div className="block lg:hidden">
        <Carousel className="w-full">
          <CarouselContent className="gap-3">
            {visitorStats.map((stat, idx) => (
              <CarouselItem key={idx}>
                <TrafficCard stat={stat} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
