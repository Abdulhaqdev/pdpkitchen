import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import OrdersByDatePage from '@/features/orders/components/orders-by-date';

export const metadata = {
  title: "Dashboard: Sana bo'yicha buyurtmalar"
};

export default function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title="Sana bo'yicha buyurtmalar"
            description="Muayyan sana uchun buyurtmalarni ko'ring"
          />
        </div>
        <Separator />
        <OrdersByDatePage />
      </div>
    </PageContainer>
  );
}
