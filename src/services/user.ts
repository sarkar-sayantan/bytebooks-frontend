import { apiClient } from './apiClient';
import { Employee, User } from '@/types';


export const userService = {
  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await apiClient.get<User>(`/users/${email}`);
    } catch (error) {
      return null;
    }
  },

  // Create a new user
  async createUser(user: Partial<User>): Promise<User> {
    return apiClient.post<User>('/users', user);
  },

  // Get employee by email
  async getEmployeeByEmail(email: string): Promise<Employee | null> {
    try {
      return await apiClient.get<Employee>(`/employees/email/${email}`);
    } catch (error) {
      return null;
    }
  },
};
