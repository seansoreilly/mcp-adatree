import { create } from 'zustand';
import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_ADATREE_API_URL || 'https://cdr-insights-prod.api.adatree.com.au';
const API_VERSION = process.env.REACT_APP_ADATREE_API_VERSION || 'v1';

// Types for API responses
interface Transaction {
  transactionId: string;
  amount: number;
  description: string;
  transactionDate: string;
  category?: string;
  type: 'DEBIT' | 'CREDIT';
  status: 'PENDING' | 'POSTED';
}

interface TransactionResponse {
  data: Transaction[];
  metadata: {
    totalRecords: number;
    pageSize: number;
    pageNumber: number;
  };
}

interface AdaTreeCredentials {
  cdrArrangementId: string;
  consentId: string;
  consumerId: string;
}

interface AdaTreeState {
  credentials: AdaTreeCredentials | null;
  isAuthenticated: boolean;
  setCredentials: (credentials: AdaTreeCredentials) => void;
  clearCredentials: () => void;
}

export const useAdaTreeStore = create<AdaTreeState>((set) => ({
  credentials: null,
  isAuthenticated: false,
  setCredentials: (credentials) => set({ credentials, isAuthenticated: true }),
  clearCredentials: () => set({ credentials: null, isAuthenticated: false }),
}));

export class AdaTreeService {
  private static instance: AdaTreeService;
  private credentials: AdaTreeCredentials | null = null;
  private axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/${API_VERSION}`,
    timeout: 10000,
  });

  private constructor() {
    // Initialize the axios instance with the correct base URL
    this.axiosInstance = axios.create({
      baseURL: `${API_BASE_URL}/${API_VERSION}`,
      timeout: 10000,
    });
    
    // Initialize axios interceptors for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('AdaTree API Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  static getInstance(): AdaTreeService {
    if (!AdaTreeService.instance) {
      AdaTreeService.instance = new AdaTreeService();
    }
    return AdaTreeService.instance;
  }

  setCredentials(credentials: AdaTreeCredentials) {
    this.credentials = credentials;
    useAdaTreeStore.getState().setCredentials(credentials);
    
    // Update axios headers with new credentials
    this.axiosInstance.defaults.headers.common['X-CDR-ARRANGEMENT-ID'] = credentials.cdrArrangementId;
    this.axiosInstance.defaults.headers.common['X-CONSENT-ID'] = credentials.consentId;
    this.axiosInstance.defaults.headers.common['X-CONSUMER-ID'] = credentials.consumerId;
  }

  async getTransactions(params: {
    fromDate?: string;
    toDate?: string;
    pageSize?: number;
    pageNumber?: number;
  } = {}): Promise<Transaction[]> {
    if (!this.credentials) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await this.axiosInstance.get<TransactionResponse>('/transactions', {
        params: {
          page_size: params.pageSize || 100,
          page: params.pageNumber || 1,
          from_date: params.fromDate,
          to_date: params.toDate,
        },
      });

      return response.data.data;
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          useAdaTreeStore.getState().clearCredentials();
          throw new Error('Authentication failed. Please re-authenticate.');
        }
        if (axiosError.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
      }
      throw error;
    }
  }

  async getAccountBalance(): Promise<number> {
    if (!this.credentials) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await this.axiosInstance.get<{ balance: number }>('/accounts/balance');
      return response.data.balance;
    } catch (error) {
      console.error('Error fetching account balance:', error);
      throw error;
    }
  }
}

export const handleError = (error: unknown): never => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { status?: number; data?: unknown } };
    if (axiosError.response?.status === 401) {
      throw new Error('Unauthorized: Please check your credentials');
    }
    if (axiosError.response?.data) {
      const errorData = axiosError.response.data as Record<string, unknown>;
      throw new Error(`API Error: ${JSON.stringify(errorData)}`);
    }
  }
  throw error;
}; 