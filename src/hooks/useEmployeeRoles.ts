import { useQuery } from '@tanstack/react-query';
import { employeeRolesService } from '@/services/employeeRoles';
import { useTenant } from '@/components/providers/TenantProvider';

export const useEmployeeRoles = () => {
  const { tenant } = useTenant();
  return useQuery({
    queryKey: ['employee-roles', tenant.id],
    queryFn: () => employeeRolesService.getEmployeeRoles(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
