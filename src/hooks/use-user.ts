import { useApiQuery } from '@/lib/api';
import { Self } from '@/types/user';

export function useUser() {
  return useApiQuery<Self>('self/', {
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: false // Don't retry if unauthorized
  });
}
