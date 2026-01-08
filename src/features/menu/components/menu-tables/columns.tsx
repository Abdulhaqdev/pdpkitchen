'use client';

import { ColumnDef } from '@tanstack/react-table';
import { WeeklyMenu } from '@/types/menu';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';
import { CellAction } from './cell-action';

interface ColumnsProps {
  onEditMenu: (date: string) => void;
}

export const columns = ({
  onEditMenu
}: ColumnsProps): ColumnDef<WeeklyMenu>[] => [
  {
    accessorKey: 'menu_date',
    header: 'Sana',
    cell: ({ row }) => {
      const date = row.original.menu_date;
      const isToday = date === format(new Date(), 'yyyy-MM-dd');
      return (
        <div className='flex items-center gap-2'>
          <span>{format(new Date(date), 'd MMM yyyy', { locale: uz })}</span>
          {isToday && (
            <Badge variant='default' className='text-xs'>
              Bugun
            </Badge>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: 'day_of_week',
    header: 'Kun',
    cell: ({ row }) => {
      const dayName = row.original.day_of_week;
      return <span className='font-medium'>{dayName}</span>;
    }
  },
  {
    accessorKey: 'breakfast_dish',
    header: 'Nonushta',
    cell: ({ row }) => {
      const dish = row.original.breakfast_dish;
      return dish ? (
        <span>{dish}</span>
      ) : (
        <span className='text-muted-foreground italic'>-</span>
      );
    }
  },
  {
    accessorKey: 'lunch_dish',
    header: 'Tushlik',
    cell: ({ row }) => {
      const dish = row.original.lunch_dish;
      return dish ? (
        <span>{dish}</span>
      ) : (
        <span className='text-muted-foreground italic'>-</span>
      );
    }
  },
  {
    accessorKey: 'dinner_dish',
    header: 'Kechki ovqat',
    cell: ({ row }) => {
      const dish = row.original.dinner_dish;
      return dish ? (
        <span>{dish}</span>
      ) : (
        <span className='text-muted-foreground italic'>-</span>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} onEdit={onEditMenu} />
  }
];
