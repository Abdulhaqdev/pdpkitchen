'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { ComplaintRead, ComplaintStatusEnum } from '@/types/complaints';
import { CellAction } from './cell-action';
import { format } from 'date-fns';

const statusConfig: Record<
  ComplaintStatusEnum,
  {
    label: string;
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
  }
> = {
  PENDING: { label: 'Kutilmoqda', variant: 'secondary' },
  REVIEWED: { label: "Ko'rib chiqildi", variant: 'outline' },
  RESOLVED: { label: 'Hal qilindi', variant: 'default' },
  REJECTED: { label: 'Rad etildi', variant: 'destructive' }
};

const mealTypeLabels: Record<string, string> = {
  BREAKFAST: 'Nonushta',
  LUNCH: 'Tushlik',
  DINNER: 'Kechki ovqat'
};

export const columns: ColumnDef<ComplaintRead>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'student',
    header: 'Talaba',
    cell: ({ row }) => {
      const student = row.original.student;
      return (
        <div>
          <p className='font-medium'>
            {student.first_name} {student.last_name}
          </p>
          <p className='text-muted-foreground text-sm'>{student.pinfl}</p>
        </div>
      );
    }
  },
  {
    accessorKey: 'meal_type',
    header: 'Ovqat turi',
    cell: ({ row }) => {
      const mealType = row.original.meal_type;
      return (
        <Badge variant='outline'>{mealTypeLabels[mealType] || mealType}</Badge>
      );
    }
  },
  {
    accessorKey: 'complaint_text',
    header: 'Shikoyat',
    cell: ({ row }) => (
      <div
        className='max-w-[300px] truncate'
        title={row.original.complaint_text}
      >
        {row.original.complaint_text}
      </div>
    )
  },
  {
    accessorKey: 'status',
    header: 'Holat',
    cell: ({ row }) => {
      const status = row.original.status;
      const config = statusConfig[status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Yaratilgan sana',
    cell: ({ row }) => {
      try {
        return format(new Date(row.original.created_at), 'dd.MM.yyyy HH:mm');
      } catch {
        return row.original.created_at;
      }
    }
  },
  {
    id: 'actions',
    header: 'Amallar',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
