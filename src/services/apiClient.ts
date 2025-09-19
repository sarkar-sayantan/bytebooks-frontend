import axios, { AxiosInstance, AxiosResponse, AxiosHeaders } from 'axios';
import { getSession } from "next-auth/react";

class ApiClient {
  private client: AxiosInstance;


  constructor() {
  
    this.client = axios.create({
      
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'      
      },
    });
  }

  async requestConfig() {
    const session = await getSession();
    console.log("API CLIENT - Session in requestConfig:", session);
    if (!session?.user) {
      window.location.href = "/";
      return Promise.reject("No session found");
    }

    const headers =
      this.client.defaults.headers instanceof AxiosHeaders
        ? this.client.defaults.headers
        : new AxiosHeaders(this.client.defaults.headers);

    if (session.user.accessToken) {
      headers.set("Authorization", `Bearer ${session.user.accessToken}`);
    }

    if (session.user.tenantId) {
      headers.set("X-Tenant-ID", session.user.tenantId);
    }

    return { headers };
  }

  private unwrap<T>(payload: unknown): T {
    if (payload && typeof payload === 'object' && (payload as { data?: unknown }).data !== undefined) {
      return (payload as { data: T }).data;
    }
    return payload as T;
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const config = await this.requestConfig();
    const response = await this.client.get<T>(url, { params, ...config });
    return this.unwrap<T>(response.data as unknown);
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const config = await this.requestConfig();
    const response = await this.client.post<T>(url, data, config);
    return this.unwrap<T>(response.data as unknown);
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const config = await this.requestConfig();
    const response = await this.client.put<T>(url, data, config);
    return this.unwrap<T>(response.data as unknown);
  }

  async delete<T>(url: string): Promise<T> {
    const config = await this.requestConfig();
    const response = await this.client.delete<T>(url, config);
    return this.unwrap<T>(response.data as unknown);
  }
}

export const apiClient = new ApiClient();
