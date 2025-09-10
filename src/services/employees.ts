import { apiClient } from './apiClient';
import { Employee, CreateEmployeeRequest } from '@/types';

export const employeesService = {
  // Get all employees for a tenant
  async getEmployees(search?: string, role?: string): Promise<Employee[]> {
    const params = {
      ...(search && { search }),
      ...(role && { role }),
    };
    const result = await apiClient.get<unknown>(`/employees`, params);
    if (Array.isArray(result)) return result as Employee[];
    if (result && typeof result === 'object') {
      const container = result as Record<string, unknown>;
      const maybe = (container.data ?? container.employees ?? container.items) as unknown;
      if (Array.isArray(maybe)) return maybe as Employee[];
    }
    return [];
  },

  // Create a new employee
  async createEmployee(employee: CreateEmployeeRequest): Promise<Employee> {
    return apiClient.post<Employee>('/employees', employee);
  },

  // Get employee by ID
  async getEmployeeById(id: string): Promise<Employee> {
    return apiClient.get<Employee>(`/employees/detail/${id}`);
  },

  // Update an employee
  async updateEmployee(id: string, employee: Partial<CreateEmployeeRequest>): Promise<Employee> {
    return apiClient.put<Employee>(`/employees/detail/${id}`, employee);
  },

  // Delete an employee
  async deleteEmployee(id: string): Promise<void> {
    return apiClient.delete<void>(`/employees/detail/${id}`);
  },
};
