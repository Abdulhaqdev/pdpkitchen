import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProfileViewPage from '@/features/profile/components/profile-view-page';

export const metadata = {
  title: 'Dashboard : Student Detail',
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <ProfileViewPage studentId={id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}