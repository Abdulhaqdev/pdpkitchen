'use client';

import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { useApiQuery } from '@/lib/api';
import { MealLogList } from '@/types/meals';
import { PaginatedResponse } from '@/types/api';
import { columns } from './meal-tables/columns';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { MealTable } from './meal-tables';

export default function MealListingPage() {
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [search] = useQueryState('search', parseAsString.withDefault(''));

  const params = new URLSearchParams({
    page: page.toString(),
    page_size: perPage.toString(),
    ...(search && { search })
  }).toString();

  const endpoint = `meals/?${params}`;

  const { data, isPending, error } =
    useApiQuery<PaginatedResponse<MealLogList>>(endpoint);

  if (isPending) {
    return <DataTableSkeleton columnCount={6} rowCount={8} filterCount={1} />;
  }

  if (error) {
    return (
      <div className='flex h-24 items-center justify-center text-center'>
        Xatolik yuklashda: {error.message}
      </div>
    );
  }

  const meals: MealLogList[] = data?.results || [];
  const totalMeals = data?.count || 0;

  return <MealTable data={meals} totalItems={totalMeals} columns={columns} />;
}
