import { apiClient } from './apiClient';
import { Entry, CreateEntryRequest, EntryFilters } from '@/types';

export const entriesService = {
  // Get all entries for a tenant
  async getEntries(filters?: EntryFilters): Promise<Entry[]> {
    const params = {
      ...filters,
    };
    const result = await apiClient.get<unknown>(`/entries`, params);
    if (Array.isArray(result)) return result as Entry[];
    if (result && typeof result === 'object') {
      const container = result as Record<string, unknown>;
      const maybe = (container.data ?? container.entries ?? container.items) as unknown;
      if (Array.isArray(maybe)) return maybe as Entry[];
    }
    return [];
  },

  // Create a new entry
  async createEntry(entry: CreateEntryRequest): Promise<Entry> {
    return apiClient.post<Entry>('/entries', entry);
  },

  // Get entry by ID
  async getEntryById(id: string): Promise<Entry> {
    return apiClient.get<Entry>(`/entries/detail/${id}`);
  },

  // Update an entry
  async updateEntry(id: string, entry: Partial<CreateEntryRequest>): Promise<Entry> {
    return apiClient.put<Entry>(`/entries/detail/${id}`, entry);
  },

  // Delete an entry
  async deleteEntry(id: string): Promise<void> {
    return apiClient.delete<void>(`/entries/detail/${id}`);
  },

  // Get dashboard statistics
  async getDashboardStats(): Promise<{
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlyBalance: number;
  }> {
    return apiClient.get(`/entries/stats`);
  },

  // Get chart data for dashboard
  async getChartData(year?: number): Promise<{
    month: string;
    income: number;
    expenses: number;
    balance: number;
  }[]> {
    return apiClient.get(`/entries/chart`, { year });
  },
};
