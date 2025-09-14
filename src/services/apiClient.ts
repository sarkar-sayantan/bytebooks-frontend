import axios, { AxiosInstance, AxiosResponse, AxiosHeaders } from 'axios';
import { getTenantId } from '@/components/providers/TenantProvider';
import { getSession } from "next-auth/react";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    const teantId = getTenantId();
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': teantId || '', // Default tenant ID header
      },
    });

    this.client.interceptors.request.use(
      async (config) => {
        // Only on client-side
        if (typeof window !== "undefined") {
          const session = await getSession();
          if (!session) {
            // No session, redirect immediately
            window.location.href = "/";
            return Promise.reject("No session found");
          }

          // Optionally, send access token in Authorization header
          if (session?.user?.accessToken) {
            const headers = config.headers instanceof AxiosHeaders
              ? config.headers
              : new AxiosHeaders(config.headers);
            headers.set("Authorization", `Bearer ${session.user.accessToken}`);
            config.headers = headers;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && typeof window !== "undefined") {
          window.location.href = "/";
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
