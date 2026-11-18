import {
  PredictRequest,
  PredictResponse,
  RetrainRequest,
  MetricsResponse,
  TreeResponse,
  DatasetResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Transformed': 'true',
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
      });

      if (!response.ok) {
        let errorMsg = `HTTP Error: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            if (typeof errorData.detail === 'string') {
              errorMsg = errorData.detail;
            } else if (Array.isArray(errorData.detail)) {
              errorMsg = errorData.detail.map((d: any) => `${d.loc?.join('.')}: ${d.msg}`).join(', ');
            }
          }
        } catch {
          // ignore parsing error
        }
        throw new Error(errorMsg);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error(`Unable to connect to backend at ${this.baseUrl}. Please verify the server is running.`);
      }
      throw err;
    }
  }

  async predict(measurements: PredictRequest): Promise<PredictResponse> {
    return this.request<PredictResponse>('/predict', {
      method: 'POST',
      body: JSON.stringify(measurements),
    });
  }

  async getMetrics(): Promise<MetricsResponse> {
    return this.request<MetricsResponse>('/metrics');
  }

  async getTree(): Promise<TreeResponse> {
    return this.request<TreeResponse>('/tree');
  }

  async retrain(params: RetrainRequest): Promise<MetricsResponse> {
    return this.request<MetricsResponse>('/retrain', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getDataset(): Promise<DatasetResponse> {
    return this.request<DatasetResponse>('/dataset');
  }

  async checkHealth(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
