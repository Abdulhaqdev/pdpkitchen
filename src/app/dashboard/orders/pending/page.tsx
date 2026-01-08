import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import PendingMealsPage from '@/features/orders/components/pending-meals';

export const metadata = {
  title: 'Dashboard: Kutilayotgan ovqatlar'
};

export default function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Kutilayotgan ovqatlar'
            description='Buyurtma bergan lekin hali ovqatlanmagan talabalar'
          />
        </div>
        <Separator />
        <PendingMealsPage />
      </div>
    </PageContainer>
  );
}
