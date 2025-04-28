import { create } from 'zustand';

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

  private constructor() {}

  static getInstance(): AdaTreeService {
    if (!AdaTreeService.instance) {
      AdaTreeService.instance = new AdaTreeService();
    }
    return AdaTreeService.instance;
  }

  setCredentials(credentials: AdaTreeCredentials) {
    this.credentials = credentials;
    useAdaTreeStore.getState().setCredentials(credentials);
  }

  async getTransactions() {
    if (!this.credentials) {
      throw new Error('Not authenticated');
    }

    // TODO: Implement actual API call to AdaTree
    try {
      // Placeholder for API implementation
      return [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }
} 