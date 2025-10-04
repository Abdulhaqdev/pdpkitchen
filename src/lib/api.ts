// utils/api.ts
import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';

const BASE_URL = 'https://pdpkitchen.diyarbek.uz/api/';

const getAccessToken = () => localStorage.getItem('access_token');

const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) throw new Error('Refresh token topilmadi');

  const response = await fetch(`${BASE_URL}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) throw new Error('Token yangilashda xatolik');

  const data = await response.json();
  localStorage.setItem('access_token', data.access);
  return data.access;
};

// Asosiy so‘rov funksiyasi
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  let token = getAccessToken();
  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    const isFormData = options.body instanceof FormData;
    const headers: HeadersInit = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    // Agar FormData bo‘lsa Content-Type avtomatik qo‘yilsin
    if (isFormData && 'Content-Type' in headers) {
      delete (headers as any)['Content-Type'];
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401 && retries < maxRetries - 1) {
      try {
        token = await refreshToken();
        retries++;
        continue;
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        throw new Error('Sessiya tugadi. Qayta kirish kerak');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP xatolik: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return response.blob();
    }
    return response.json();
  }
};

// 🔹 useApiQuery
export const useApiQuery = <TData, TError = Error>(
  endpoint: string,
  options?: UseQueryOptions<TData, TError>
) => {
  return useQuery<TData, TError>({
    queryKey: [endpoint],
    queryFn: () => apiRequest(endpoint, { method: 'GET' }),
    ...options,
  });
};

// 🔹 useApiMutation
export const useApiMutation = <
  TData = unknown,
  TVariables = unknown,
  TError = Error
>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
  options?: UseMutationOptions<TData, TError, TVariables | FormData>
) => {
  return useMutation<TData, TError, TVariables | FormData>({
    mutationFn: async (variables: TVariables | FormData) => {
      if (variables instanceof FormData) {
        return apiRequest(endpoint, { method, body: variables });
      } else if (variables) {
        return apiRequest(endpoint, {
          method,
          body: JSON.stringify(variables),
        });
      } else {
        return apiRequest(endpoint, { method });
      }
    },
    ...options,
  });
};

// 🔹 useDeleteStudent
export const useDeleteStudent = <TError = Error>(
  studentId: string | number,
  options?: UseMutationOptions<void, TError, void>
) => {
  const queryClient = useQueryClient();
  const endpoint = `students/${studentId.toString()}/`;

  return useApiMutation<void, void, TError>(endpoint, 'DELETE', {
    ...(options as UseMutationOptions<void, TError, void | FormData>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};
