import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import MealStatisticsPage from '@/features/meals/components/meal-statistics';

export const metadata = {
  title: 'Dashboard: Ovqatlanish statistikasi'
};

export default function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Ovqatlanish statistikasi'
            description="Ovqatlanish ko'rsatkichlarini ko'ring"
          />
        </div>
        <Separator />
        <MealStatisticsPage />
      </div>
    </PageContainer>
  );
}
