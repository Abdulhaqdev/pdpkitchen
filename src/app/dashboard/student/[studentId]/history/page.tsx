import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import StudentHistoryPage from '@/features/students/components/student-history';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Dashboard: Talaba ovqatlanish tarixi'
};

type PageProps = {
  params: Promise<{ studentId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { studentId } = await params;

  return (
    <PageContainer scrollable>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Ovqatlanish tarixi'
            description='Talabaning ovqatlanish tarixi va statistikasi'
          />
        </div>
        <Separator />
        <Suspense fallback={<Skeleton className='h-[400px] w-full' />}>
          <StudentHistoryPage studentId={studentId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
