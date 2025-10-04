'use client';

import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { useApiQuery } from '@/lib/api'; // Assuming the API hooks are in '@/lib/api'
import { Student } from '@/constants/data';
import { columns } from './student-tables/columns';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { StudentTable } from './student-tables';

type PaginatedStudents = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Student[];
};

type StudentListingPage = {};

export default function StudentListingPage({}: StudentListingPage) {
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [search] = useQueryState('search', parseAsString.withDefault(''));

  const params = new URLSearchParams({
    page: page.toString(),
    page_size: perPage.toString(),
    ...(search && { search })
  }).toString();

  const endpoint = `students/?${params}`;

  const { data, isPending, error } = useApiQuery<PaginatedStudents>(endpoint);

  if (isPending) {
    return <DataTableSkeleton columnCount={8} rowCount={8} filterCount={1} />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-24 text-center">
        Xatolik yuklashda: {error.message}
      </div>
    );
  }

  const students: Student[] = data?.results || [];
  const totalStudents = data?.count || 0;

  return (
    <StudentTable
      data={students}
      totalItems={totalStudents}
      columns={columns}
    />
  );
}