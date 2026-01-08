import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import LogByFacePage from '@/features/meals/components/log-by-face';

export const metadata = {
  title: 'Dashboard: Yuz orqali ovqatlanish'
};

export default function Page() {
  return (
    <PageContainer scrollable>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Yuz orqali ovqatlanish'
            description='Talabaning rasmini yuklang va ovqatlanishni qayd eting'
          />
        </div>
        <Separator />
        <LogByFacePage />
      </div>
    </PageContainer>
  );
}
