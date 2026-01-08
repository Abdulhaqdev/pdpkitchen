'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';
import { useApiQuery } from '@/lib/api';
import { MealStatisticsResponse } from '@/types/meals';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  count: {
    label: 'Ovqatlanishlar'
  },
  breakfast: {
    label: 'Nonushta',
    color: 'hsl(var(--chart-1))'
  },
  lunch: {
    label: 'Tushlik',
    color: 'hsl(var(--chart-2))'
  },
  dinner: {
    label: 'Kechki ovqat',
    color: 'hsl(var(--chart-3))'
  }
} satisfies ChartConfig;

export function PieGraph() {
  const { data, isPending, error } =
    useApiQuery<MealStatisticsResponse>('meals/statistics/');

  const chartData = React.useMemo(() => {
    if (!data?.this_month) return [];
    return [
      {
        name: 'breakfast',
        count: data.this_month.breakfast,
        fill: 'var(--primary)'
      },
      {
        name: 'lunch',
        count: data.this_month.lunch,
        fill: 'var(--primary-light, hsl(var(--primary) / 0.7))'
      },
      {
        name: 'dinner',
        count: data.this_month.dinner,
        fill: 'var(--primary-lighter, hsl(var(--primary) / 0.4))'
      }
    ];
  }, [data]);

  const totalMeals = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  const topMealType = React.useMemo(() => {
    if (chartData.length === 0) return null;
    const sorted = [...chartData].sort((a, b) => b.count - a.count);
    return sorted[0];
  }, [chartData]);

  if (isPending) {
    return (
      <Card className='@container/card'>
        <CardHeader>
          <Skeleton className='h-5 w-[200px]' />
          <Skeleton className='h-4 w-[150px]' />
        </CardHeader>
        <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
          <Skeleton className='mx-auto h-[250px] w-[250px] rounded-full' />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='@container/card'>
        <CardContent className='pt-6'>
          <p className='text-destructive text-center'>
            Xatolik: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Ovqat turlari bo'yicha</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            Bu oydagi ovqatlanishlar taqsimoti
          </span>
          <span className='@[540px]/card:hidden'>Bu oy</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square h-[250px]'
        >
          <PieChart>
            <defs>
              {['breakfast', 'lunch', 'dinner'].map((type, index) => (
                <linearGradient
                  key={type}
                  id={`fill${type}`}
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop
                    offset='0%'
                    stopColor='var(--primary)'
                    stopOpacity={1 - index * 0.25}
                  />
                  <stop
                    offset='100%'
                    stopColor='var(--primary)'
                    stopOpacity={0.8 - index * 0.25}
                  />
                </linearGradient>
              ))}
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData.map((item) => ({
                ...item,
                fill: `url(#fill${item.name})`
              }))}
              dataKey='count'
              nameKey='name'
              innerRadius={60}
              strokeWidth={2}
              stroke='var(--background)'
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalMeals.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground text-sm'
                        >
                          Jami ovqatlanish
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        {topMealType && (
          <div className='flex items-center gap-2 leading-none font-medium'>
            {chartConfig[topMealType.name as keyof typeof chartConfig]?.label ||
              topMealType.name}{' '}
            eng ko'p -{' '}
            {totalMeals > 0
              ? ((topMealType.count / totalMeals) * 100).toFixed(1)
              : 0}
            %
          </div>
        )}
        <div className='text-muted-foreground leading-none'>
          Bu oydagi statistika
        </div>
      </CardFooter>
    </Card>
  );
}
