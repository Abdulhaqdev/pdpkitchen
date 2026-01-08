import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import MealsByDatePage from '@/features/meals/components/meals-by-date';

export const metadata = {
  title: "Dashboard: Sana bo'yicha ovqatlanish"
};

export default function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title="Sana bo'yicha ovqatlanish"
            description="Muayyan sana uchun ovqatlanish ma'lumotlarini ko'ring"
          />
        </div>
        <Separator />
        <MealsByDatePage />
      </div>
    </PageContainer>
  );
}
