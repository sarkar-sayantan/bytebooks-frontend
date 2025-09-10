import { apiClient } from './apiClient';
import { Customer, CreateCustomerRequest } from '@/types';

export const customersService = {
  // Get all customers for a tenant
  async getCustomers(search?: string): Promise<Customer[]> {
    const params = {
      ...(search && { search }),
    };
    const result = await apiClient.get<unknown>(`/customers`, params);
    if (Array.isArray(result)) return result as Customer[];
    if (result && typeof result === 'object') {
      const container = result as Record<string, unknown>;
      const maybe = (container.data ?? container.customers ?? container.items) as unknown;
      if (Array.isArray(maybe)) return maybe as Customer[];
    }
    return [];
  },

  // Create a new customer
  async createCustomer(customer: CreateCustomerRequest): Promise<Customer> {
    return apiClient.post<Customer>('/customers', customer);
  },

  // Get customer by ID
  async getCustomerById(id: string): Promise<Customer> {
    return apiClient.get<Customer>(`/customers/detail/${id}`);
  },

  // Update a customer
  async updateCustomer(id: string, customer: Partial<CreateCustomerRequest>): Promise<Customer> {
    return apiClient.put<Customer>(`/customers/detail/${id}`, customer);
  },

  // Delete a customer
  async deleteCustomer(id: string): Promise<void> {
    return apiClient.delete<void>(`/customers/detail/${id}`);
  },
};
