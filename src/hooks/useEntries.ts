import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { entriesService } from '@/services/entries';
import { CreateEntryRequest, EntryFilters } from '@/types';
import { useTenant } from '@/components/providers/TenantProvider';

export const useEntries = (filters?: EntryFilters) => {
  const { tenant } = useTenant();
  return useQuery({
    queryKey: ['entries', tenant.id, filters],
    queryFn: () => entriesService.getEntries(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entry: CreateEntryRequest) => entriesService.createEntry(entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['chart-data'] });
    },
  });
};

export const useUpdateEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, entry }: { id: string; entry: Partial<CreateEntryRequest> }) =>
      entriesService.updateEntry(id, entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['chart-data'] });
    },
  });
};

export const useDeleteEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => entriesService.deleteEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['chart-data'] });
    },
  });
};

export const useDashboardStats = () => {
  const { tenant } = useTenant();
  return useQuery({
    queryKey: ['dashboard-stats', tenant.id],
    queryFn: () => entriesService.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useChartData = (year?: number) => {
  const { tenant } = useTenant();
  return useQuery({
    queryKey: ['chart-data', tenant.id, year],
    queryFn: () => entriesService.getChartData(year),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
