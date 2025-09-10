import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customersService } from '@/services/customers';
import { CreateCustomerRequest } from '@/types';
import { useTenant } from '@/components/providers/TenantProvider';

export const useCustomers = (search?: string) => {
  const { tenant } = useTenant();
  return useQuery({
    queryKey: ['customers', tenant.id, search],
    queryFn: () => customersService.getCustomers(search),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customer: CreateCustomerRequest) => customersService.createCustomer(customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, customer }: { id: string; customer: Partial<CreateCustomerRequest> }) =>
      customersService.updateCustomer(id, customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customersService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};
