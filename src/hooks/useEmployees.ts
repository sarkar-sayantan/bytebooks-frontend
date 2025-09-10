import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeesService } from '@/services/employees';
import { CreateEmployeeRequest } from '@/types';
import { useTenant } from '@/components/providers/TenantProvider';

export const useEmployees = (search?: string, role?: string) => {
  const { tenant } = useTenant();
  return useQuery({
    queryKey: ['employees', tenant.id, search, role],
    queryFn: () => employeesService.getEmployees(search, role),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employee: CreateEmployeeRequest) => employeesService.createEmployee(employee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, employee }: { id: string; employee: Partial<CreateEmployeeRequest> }) =>
      employeesService.updateEmployee(id, employee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeesService.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
