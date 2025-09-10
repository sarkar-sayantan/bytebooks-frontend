import axios, { AxiosInstance, AxiosResponse, AxiosHeaders } from 'axios';
import { getTenantId } from '@/components/providers/TenantProvider';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available (client-side only)
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('authToken');
          const headers = config.headers instanceof AxiosHeaders
            ? config.headers
            : new AxiosHeaders(config.headers);
          if (token) headers.set('Authorization', `Bearer ${token}`);
          const tenantId = getTenantId();
          headers.set('X-Tenant-ID', tenantId);
          config.headers = headers;
          return config;
        }
        // Server-side: still ensure tenant header is set
        const headers = config.headers instanceof AxiosHeaders
          ? config.headers
          : new AxiosHeaders(config.headers);
        headers.set('X-Tenant-ID', getTenantId());
        config.headers = headers;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access (client-side only)
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private unwrap<T>(payload: unknown): T {
    if (payload && typeof payload === 'object' && (payload as { data?: unknown }).data !== undefined) {
      return (payload as { data: T }).data;
    }
    return payload as T;
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return this.unwrap<T>(response.data as unknown);
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return this.unwrap<T>(response.data as unknown);
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return this.unwrap<T>(response.data as unknown);
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return this.unwrap<T>(response.data as unknown);
  }
}

export const apiClient = new ApiClient();
