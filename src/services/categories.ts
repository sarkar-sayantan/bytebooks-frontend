import { apiClient } from './apiClient';
import { Category } from '@/types';

export const categoriesService = {
  async getCategories(type?: 'income' | 'expense'): Promise<Category[]> {
    const params: Record<string, unknown> = {};
    if (type) params.type = type;
    const result = await apiClient.get<unknown>('/categories', params);
    if (Array.isArray(result)) return result as Category[];
    if (result && typeof result === 'object') {
      const container = result as Record<string, unknown>;
      const maybe = (container.data ?? container.categories ?? container.items) as unknown;
      if (Array.isArray(maybe)) return maybe as Category[];
    }
    return [];
  },
};


