// @/features/students/components/student-table/columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Student } from '@/constants/data';
import { CellAction } from './cell-action';
import Image from 'next/image';

export const columns: ColumnDef<Student>[] = [
  {
    id: 'search',
    accessorKey: 'id',
    header: 'Qidiruv',
    cell: ({ cell }) => <div>{cell.getValue() as string}</div>,
    meta: {
      label: 'Qidiruv (Ism, PINFL...)',
      placeholder: 'Qidirish (Ism, PINFL...)',
      variant: 'text',
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
        (row.original.middle_name?.toLowerCase().includes(searchValue) ?? true)
      );
    },
  },
  {
    accessorKey: 'pinfl',
    header: 'PINFL',
  },
  {
    accessorKey: 'first_name',
    header: 'Ism',
    cell: ({ row }) => {
      const fullName = `${row.original.first_name} ${row.original.last_name} ${row.original.middle_name || ''}`.trim();
      return <div>{fullName}</div>;
    },
  },
  {
    accessorKey: 'student_type',
    header: 'Talaba turi',
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.student_type}</Badge>
    ),
  },
  {
    accessorKey: 'course',
    header: 'Kurs',
  },
  {
    accessorKey: 'enrollment_date',
    header: 'Ro\'yxatga olingan sana',
    cell: ({ row }) => row.original.enrollment_date,
  },
  {
    accessorKey: 'until_date',
    header: 'Muddat tugash sanasi',
    cell: ({ row }) => row.original.until_date,
  },
  {
    accessorKey: 'is_active',
    header: 'Faol',
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? 'default' : 'secondary'}>
        {row.original.is_active ? 'Ha' : 'Yo\'q'}
      </Badge>
    ),
  },
  {
    accessorKey: 'image',
    header: 'Rasm',
    cell: ({ row }) => (
      row.original.image ? (
        <Image
          src={row.original.image}
          alt="Student image"
          width={32} // Adjust based on your design
          height={32} // Adjust based on your design
          className="h-8 w-8 rounded object-cover"
        />
      ) : (
        <div className="h-8 w-8 bg-muted rounded" />
      )
    ),
  },
  {
    id: 'actions',
    header: 'Amallar',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];