import { useApiQuery } from '@/lib/api';
import { StudentList } from '@/types/students';

export function useStudentSearch(query: string) {
  return useApiQuery<StudentList[]>(`search-students/?search=${query}`, {
    enabled: query.length >= 2,
    staleTime: 30 * 1000 // Cache for 30 seconds
  });
}
