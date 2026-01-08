'use client';

import { useApiQuery } from '@/lib/api';
import { MealStatisticsResponse } from '@/types/meals';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  IconToolsKitchen2,
  IconSunrise,
  IconSun,
  IconMoon
} from '@tabler/icons-react';

interface StatCardProps {
  title: string;
  description: string;
  total: number;
  breakfast: number;
  lunch: number;
  dinner: number;
  isLoading?: boolean;
}

function StatCard({
  title,
  description,
  total,
  breakfast,
  lunch,
  dinner,
  isLoading
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className='h-4 w-[100px]' />
          <Skeleton className='h-8 w-[60px]' />
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        <CardTitle className='flex items-center gap-2 text-3xl'>
          <IconToolsKitchen2 className='h-6 w-6' />
          {total}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 text-sm'>
              <IconSunrise className='h-4 w-4 text-orange-500' />
              <span>Nonushta</span>
            </div>
            <span className='font-medium'>{breakfast}</span>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 text-sm'>
              <IconSun className='h-4 w-4 text-yellow-500' />
              <span>Tushlik</span>
            </div>
            <span className='font-medium'>{lunch}</span>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 text-sm'>
              <IconMoon className='h-4 w-4 text-blue-500' />
              <span>Kechki ovqat</span>
            </div>
            <span className='font-medium'>{dinner}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MealStatisticsPage() {
  const { data, isPending, error } =
    useApiQuery<MealStatisticsResponse>('meals/statistics/');

  if (error) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <p className='text-destructive text-center'>
            Xatolik: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>
          Ovqatlanish statistikasi
        </h2>
        <p className='text-muted-foreground'>
          Bugungi, haftalik va oylik ovqatlanish ko'rsatkichlari
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <StatCard
          title='today'
          description='Bugun'
          total={data?.today.total ?? 0}
          breakfast={data?.today.breakfast ?? 0}
          lunch={data?.today.lunch ?? 0}
          dinner={data?.today.dinner ?? 0}
          isLoading={isPending}
        />
        <StatCard
          title='this_week'
          description='Bu hafta'
          total={data?.this_week.total ?? 0}
          breakfast={data?.this_week.breakfast ?? 0}
          lunch={data?.this_week.lunch ?? 0}
          dinner={data?.this_week.dinner ?? 0}
          isLoading={isPending}
        />
        <StatCard
          title='this_month'
          description='Bu oy'
          total={data?.this_month.total ?? 0}
          breakfast={data?.this_month.breakfast ?? 0}
          lunch={data?.this_month.lunch ?? 0}
          dinner={data?.this_month.dinner ?? 0}
          isLoading={isPending}
        />
      </div>
    </div>
  );
}
