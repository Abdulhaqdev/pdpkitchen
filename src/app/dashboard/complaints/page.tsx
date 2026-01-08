import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import ComplaintListingPage from '@/features/complaints/components/complaint-listing';
import { cn } from '@/lib/utils';
import { IconChartBar } from '@tabler/icons-react';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard: Shikoyatlar'
};

export default function Page() {
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Shikoyatlar'
            description='Talabalar shikoyatlarini boshqarish'
          />
          <Link
            href='/dashboard/complaints/statistics'
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'text-xs md:text-sm'
            )}
          >
            <IconChartBar className='mr-2 h-4 w-4' /> Statistika
          </Link>
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={7} rowCount={8} filterCount={1} />
          }
        >
          <ComplaintListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
