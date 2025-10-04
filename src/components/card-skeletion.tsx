// components/skeleton/card-skeleton.tsx (example skeleton for loading state)
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CardSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className='@container/card'>
          <CardHeader>
            <div className='bg-muted mb-2 h-4 w-32 rounded'></div>
            <div className='bg-muted mb-2 h-8 w-24 rounded'></div>
          </CardHeader>
          <CardContent>
            <div className='bg-muted h-4 w-full rounded'></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
