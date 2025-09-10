import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '@/services/categories';
import { useTenant } from '@/components/providers/TenantProvider';

export const useCategories = (type?: 'income' | 'expense') => {
  const { tenant } = useTenant();
  return useQuery({
    queryKey: ['categories', tenant.id, type],
    queryFn: () => categoriesService.getCategories(type),
    staleTime: 5 * 60 * 1000,
  });
};


