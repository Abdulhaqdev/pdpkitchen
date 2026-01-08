import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import StudentsWhoOrderedPage from '@/features/orders/components/students-who-ordered';

export const metadata = {
  title: 'Dashboard: Buyurtma bergan talabalar'
};

export default function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Buyurtma bergan talabalar'
            description='Muayyan sana va ovqat turi uchun buyurtma bergan talabalar'
          />
        </div>
        <Separator />
        <StudentsWhoOrderedPage />
      </div>
    </PageContainer>
  );
}
