'use client';

import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { useApiQuery } from '@/lib/api';
import { ComplaintRead } from '@/types/complaints';
import { columns } from './complaint-tables/columns';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { ComplaintTable } from './complaint-tables';

export default function ComplaintListingPage() {
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [status] = useQueryState('status', parseAsString.withDefault(''));
  const [mealType] = useQueryState('meal_type', parseAsString.withDefault(''));

  const params = new URLSearchParams({
    page: page.toString(),
    page_size: perPage.toString(),
    ...(status && { status }),
    ...(mealType && { meal_type: mealType })
  }).toString();

  const endpoint = `meal-orders/complaints/?${params}`;

  const { data, isPending, error } = useApiQuery<ComplaintRead[]>(endpoint);

  if (isPending) {
    return <DataTableSkeleton columnCount={7} rowCount={8} filterCount={1} />;
  }

  if (error) {
    return (
      <div className='flex h-24 items-center justify-center text-center'>
        Xatolik yuklashda: {error.message}
      </div>
    );
  }

  const complaints: ComplaintRead[] = data || [];

  return (
    <ComplaintTable
      data={complaints}
      totalItems={complaints.length}
      columns={columns}
    />
  );
}
