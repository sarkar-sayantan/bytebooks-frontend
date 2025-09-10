import { apiClient } from './apiClient';

export interface EmployeeRole {
  id: string;
  name: string;
  description?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export const employeeRolesService = {
  // Get all employee roles for a tenant
  async getEmployeeRoles(): Promise<EmployeeRole[]> {
    const params = {
      includeEmployeeCount: false,
    };
    const result = await apiClient.get<unknown>('/employee-roles', params);
    if (Array.isArray(result)) return result as EmployeeRole[];
    if (result && typeof result === 'object') {
      const container = result as Record<string, unknown>;
      const maybe = (container.data ?? container.roles ?? container.items) as unknown;
      if (Array.isArray(maybe)) return maybe as EmployeeRole[];
    }
    return [];
  },
};
