import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import StudentViewPage from '@/features/products/components/student-view-page';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard : Product View',
};

type PageProps = { 
  params: Promise<{ studentId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { studentId } = await params;
  
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <StudentViewPage studentId={studentId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}