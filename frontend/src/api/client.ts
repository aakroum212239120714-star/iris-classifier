import {
  PredictRequest,
  PredictResponse,
  RetrainRequest,
  MetricsResponse,
  TreeResponse,
  DatasetResponse,
} from '../types';

const getBaseUrl = (): string => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE_URL ?? '';
  }
  return import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
};

const API_BASE_URL = getBaseUrl();

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
        const target = this.baseUrl || 'the server';
        throw new Error(`Unable to connect to backend at ${target}. Please verify the server is running.`);
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

  // --- TP1 Linear Regression ---
  async getTP1Diabetes(): Promise<import('../types').RegressionDatasetResponse> {
    return this.request<import('../types').RegressionDatasetResponse>('/tp1/diabetes');
  }

  async getTP1Iris(): Promise<import('../types').RegressionDatasetResponse> {
    return this.request<import('../types').RegressionDatasetResponse>('/tp1/iris-regression');
  }

  async predictDiabetes(data: import('../types').PredictDiabetesRequest): Promise<import('../types').PredictDiabetesResponse> {
    return this.request<import('../types').PredictDiabetesResponse>('/tp1/predict-diabetes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async predictIrisSepal(data: import('../types').PredictIrisSepalRequest): Promise<import('../types').PredictIrisSepalResponse> {
    return this.request<import('../types').PredictIrisSepalResponse>('/tp1/predict-iris-sepal', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // --- TP2 Perceptron ---
  async getTP2Binary(): Promise<import('../types').PerceptronResponse> {
    return this.request<import('../types').PerceptronResponse>('/tp2/binary');
  }

  async getTP2Multiclass(useAllFeatures: boolean = false): Promise<import('../types').PerceptronResponse> {
    return this.request<import('../types').PerceptronResponse>(`/tp2/multiclass?use_all_features=${useAllFeatures}`);
  }

  async retrainPerceptron(data: import('../types').RetrainPerceptronRequest): Promise<import('../types').PerceptronResponse> {
    return this.request<import('../types').PerceptronResponse>('/tp2/retrain', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async predictPerceptron(data: import('../types').PredictPerceptronRequest): Promise<import('../types').PredictPerceptronResponse> {
    return this.request<import('../types').PredictPerceptronResponse>('/tp2/predict', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async checkHealth(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
