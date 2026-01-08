'use client';

import { useApiQuery } from '@/lib/api';
import { WeeklyMenu } from '@/types/menu';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { columns } from './menu-tables/columns';

interface MenuListViewProps {
  onEditMenu: (date: string) => void;
}

export default function MenuListView({ onEditMenu }: MenuListViewProps) {
  const { data, isPending, error } =
    useApiQuery<WeeklyMenu[]>('meal-orders/menu/');

  const menus = data || [];
  const totalItems = menus.length;

  const { table } = useDataTable({
    data: menus,
    columns: columns({ onEditMenu }),
    pageCount: Math.ceil(totalItems / 10),
    shallow: true,
    debounceMs: 500
  });

  if (isPending) {
    return (
      <div className='space-y-4'>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className='h-12 w-full' />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-destructive py-8 text-center'>
        Xatolik: {error.message}
      </div>
    );
  }

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}
