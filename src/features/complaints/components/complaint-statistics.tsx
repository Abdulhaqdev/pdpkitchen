'use client';

import { useApiQuery } from '@/lib/api';
import { ComplaintStatistics } from '@/types/complaints';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  IconMessageReport,
  IconClock,
  IconCheck,
  IconX,
  IconEye
} from '@tabler/icons-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description?: string;
  isLoading?: boolean;
}

function StatCard({
  title,
  value,
  icon,
  description,
  isLoading
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <Skeleton className='h-4 w-[100px]' />
          <Skeleton className='h-4 w-4' />
        </CardHeader>
        <CardContent>
          <Skeleton className='h-8 w-[60px]' />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        {description && (
          <p className='text-muted-foreground text-xs'>{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function ComplaintStatisticsPage() {
  const { data, isPending, error } = useApiQuery<ComplaintStatistics>(
    'meal-orders/complaints/statistics/'
  );

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
          Shikoyatlar statistikasi
        </h2>
        <p className='text-muted-foreground'>
          Shikoyatlar bo'yicha umumiy ko'rsatkichlar
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
        <StatCard
          title='Jami shikoyatlar'
          value={data?.total_complaints ?? 0}
          icon={<IconMessageReport className='text-muted-foreground h-4 w-4' />}
          isLoading={isPending}
        />
        <StatCard
          title='Kutilmoqda'
          value={data?.by_status.pending ?? 0}
          icon={<IconClock className='h-4 w-4 text-yellow-500' />}
          isLoading={isPending}
        />
        <StatCard
          title="Ko'rib chiqildi"
          value={data?.by_status.reviewed ?? 0}
          icon={<IconEye className='h-4 w-4 text-blue-500' />}
          isLoading={isPending}
        />
        <StatCard
          title='Hal qilindi'
          value={data?.by_status.resolved ?? 0}
          icon={<IconCheck className='h-4 w-4 text-green-500' />}
          isLoading={isPending}
        />
        <StatCard
          title='Rad etildi'
          value={data?.by_status.rejected ?? 0}
          icon={<IconX className='h-4 w-4 text-red-500' />}
          isLoading={isPending}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ovqat turi bo'yicha</CardTitle>
          <CardDescription>
            Shikoyatlar ovqat turlari bo'yicha taqsimoti
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className='space-y-4'>
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full' />
            </div>
          ) : (
            <div className='space-y-4'>
              <div className='bg-muted flex items-center justify-between rounded-lg p-4'>
                <span className='font-medium'>Nonushta</span>
                <span className='text-2xl font-bold'>
                  {data?.by_meal_type.breakfast ?? 0}
                </span>
              </div>
              <div className='bg-muted flex items-center justify-between rounded-lg p-4'>
                <span className='font-medium'>Tushlik</span>
                <span className='text-2xl font-bold'>
                  {data?.by_meal_type.lunch ?? 0}
                </span>
              </div>
              <div className='bg-muted flex items-center justify-between rounded-lg p-4'>
                <span className='font-medium'>Kechki ovqat</span>
                <span className='text-2xl font-bold'>
                  {data?.by_meal_type.dinner ?? 0}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
