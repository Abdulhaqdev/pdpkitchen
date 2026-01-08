import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import ComplaintStatisticsPage from '@/features/complaints/components/complaint-statistics';

export const metadata = {
  title: 'Dashboard: Shikoyatlar statistikasi'
};

export default function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Shikoyatlar statistikasi'
            description="Shikoyatlar bo'yicha umumiy ko'rsatkichlar"
          />
        </div>
        <Separator />
        <ComplaintStatisticsPage />
      </div>
    </PageContainer>
  );
}
