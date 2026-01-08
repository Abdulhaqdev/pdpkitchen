'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { useApiQuery } from '@/lib/api';
import { DateRangeResponse } from '@/types/statistics';
import { format, subDays } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
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
  meals: {
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

export function BarGraph() {
  const endDate = format(new Date(), 'yyyy-MM-dd');
  const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');

  const { data, isPending, error } = useApiQuery<DateRangeResponse>(
    `stats/by-range/?start_date=${startDate}&end_date=${endDate}`
  );

  const [activeChart, setActiveChart] = React.useState<
    'breakfast' | 'lunch' | 'dinner'
  >('lunch');

  const chartData = React.useMemo(() => {
    if (!data?.daily_breakdown) return [];
    return data.daily_breakdown.map((day) => ({
      date: day.date,
      breakfast: day.breakfast,
      lunch: day.lunch,
      dinner: day.dinner,
      total: day.total
    }));
  }, [data]);

  const total = React.useMemo(() => {
    if (!data?.summary) return { breakfast: 0, lunch: 0, dinner: 0 };
    return {
      breakfast: data.summary.by_meal_type.breakfast,
      lunch: data.summary.by_meal_type.lunch,
      dinner: data.summary.by_meal_type.dinner
    };
  }, [data]);

  if (isPending) {
    return (
      <Card className='@container/card !pt-3'>
        <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
          <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
            <Skeleton className='h-5 w-[200px]' />
            <Skeleton className='h-4 w-[150px]' />
          </div>
        </CardHeader>
        <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
          <Skeleton className='h-[250px] w-full' />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='@container/card !pt-3'>
        <CardContent className='pt-6'>
          <p className='text-destructive text-center'>
            Xatolik: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='@container/card !pt-3'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
          <CardTitle>Kunlik ovqatlanish</CardTitle>
          <CardDescription>
            <span className='hidden @[540px]/card:block'>
              Oxirgi 30 kun ichidagi ovqatlanishlar
            </span>
            <span className='@[540px]/card:hidden'>Oxirgi 30 kun</span>
          </CardDescription>
        </div>
        <div className='flex'>
          {(['breakfast', 'lunch', 'dinner'] as const).map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className='data-[active=true]:bg-primary/5 hover:bg-primary/5 relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left transition-colors duration-200 even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6'
              onClick={() => setActiveChart(key)}
            >
              <span className='text-muted-foreground text-xs'>
                {chartConfig[key].label}
              </span>
              <span className='text-lg leading-none font-bold sm:text-3xl'>
                {total[key].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillBar' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='0%'
                  stopColor='var(--primary)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='100%'
                  stopColor='var(--primary)'
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('uz-UZ', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
              content={
                <ChartTooltipContent
                  className='w-[150px]'
                  nameKey='meals'
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('uz-UZ', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill='url(#fillBar)'
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
