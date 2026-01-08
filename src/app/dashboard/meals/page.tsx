import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import MealListingPage from '@/features/meals/components/meal-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { IconCalendar, IconChartBar } from '@tabler/icons-react';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Ovqatlanish'
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Ovqatlanish'
            description='Ovqatlanish yozuvlarini boshqarish'
          />
          <div className='flex gap-2'>
            <Link
              href='/dashboard/meals/by-date'
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'text-xs md:text-sm'
              )}
            >
              <IconCalendar className='mr-2 h-4 w-4' /> Sana bo'yicha
            </Link>
            <Link
              href='/dashboard/meals/statistics'
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'text-xs md:text-sm'
              )}
            >
              <IconChartBar className='mr-2 h-4 w-4' /> Statistika
            </Link>
          </div>
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={6} rowCount={8} filterCount={1} />
          }
        >
          <MealListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
