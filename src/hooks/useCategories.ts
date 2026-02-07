import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '@/services/categories';

import { useSession } from 'next-auth/react';
export const useCategories = (type?: 'income' | 'expense') => {
  
  const { data: session } = useSession();
  
  return useQuery({
    queryKey: ['categories', session?.user.tenantId , type],
    queryFn: () => categoriesService.getCategories(type),
    staleTime: 5 * 60 * 1000,
  });
};

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; type: 'income' | 'expense' }) =>
      categoriesService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

