'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { MealLogList } from '@/types/meals';
import { CellAction } from './cell-action';
import { format } from 'date-fns';

const mealTypeLabels: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  BREAKFAST: { label: 'Nonushta', variant: 'default' },
  LUNCH: { label: 'Tushlik', variant: 'secondary' },
  DINNER: { label: 'Kechki ovqat', variant: 'outline' }
};

export const columns: ColumnDef<MealLogList>[] = [
  {
    id: 'search',
    accessorKey: 'id',
    header: 'Qidiruv',
    cell: ({ cell }) => <div>{cell.getValue() as string}</div>,
    meta: {
      label: 'Qidiruv (Ism, PINFL...)',
      placeholder: 'Qidirish (Ism, PINFL...)',
      variant: 'text'
    },
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      if (!value) return true;
      const searchValue = (value as string).toLowerCase();
      return (
        row.original.id?.toString().toLowerCase().includes(searchValue) ||
        row.original.pinfl?.toLowerCase().includes(searchValue) ||
        row.original.first_name?.toLowerCase().includes(searchValue) ||
        row.original.last_name?.toLowerCase().includes(searchValue) ||
        row.original.student_name?.toLowerCase().includes(searchValue)
      );
    }
  },
  {
    accessorKey: 'pinfl',
    header: 'PINFL'
  },
  {
    accessorKey: 'student_name',
    header: 'Talaba ismi',
    cell: ({ row }) => {
      const fullName =
        row.original.student_name ||
        `${row.original.first_name} ${row.original.last_name}`.trim();
      return <div>{fullName}</div>;
    }
  },
  {
    accessorKey: 'meal_type',
    header: 'Ovqat turi',
    cell: ({ row }) => {
      const mealType = row.original.meal_type;
      const config = mealTypeLabels[mealType] || {
        label: mealType,
        variant: 'outline' as const
      };
      return <Badge variant={config.variant}>{config.label}</Badge>;
    }
  },
  {
    accessorKey: 'meal_date',
    header: 'Sana',
    cell: ({ row }) => {
      try {
        return format(new Date(row.original.meal_date), 'dd.MM.yyyy HH:mm');
      } catch {
        return row.original.meal_date;
      }
    }
  },
  {
    id: 'actions',
    header: 'Amallar',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
