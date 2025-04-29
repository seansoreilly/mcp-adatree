// Mock of the AdaTreeService

interface Transaction {
  transactionId: string;
  amount: number;
  description: string;
  transactionDate: string;
  category?: string;
  type: 'DEBIT' | 'CREDIT';
  status: 'PENDING' | 'POSTED';
}

interface AdaTreeCredentials {
  cdrArrangementId: string;
  consentId: string;
  consumerId: string;
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    transactionId: 'tx123',
    amount: 50.25,
    description: 'Grocery store',
    transactionDate: '2023-06-15',
    type: 'DEBIT',
    status: 'POSTED'
  },
  {
    transactionId: 'tx124',
    amount: 1200,
    description: 'Salary deposit',
    transactionDate: '2023-06-10',
    type: 'CREDIT',
    status: 'POSTED'
  }
];

export class AdaTreeService {
  private static instance: AdaTreeService;
  private credentials: AdaTreeCredentials | null = null;

  private constructor() {
    // Mock constructor
  }

  static getInstance(): AdaTreeService {
    if (!AdaTreeService.instance) {
      AdaTreeService.instance = new AdaTreeService();
    }
    return AdaTreeService.instance;
  }

  setCredentials(credentials: AdaTreeCredentials) {
    this.credentials = credentials;
  }

  async getTransactions(): Promise<Transaction[]> {
    if (!this.credentials) {
      throw new Error('Not authenticated');
    }
    return Promise.resolve(mockTransactions);
  }

  async getAccountBalance(): Promise<number> {
    if (!this.credentials) {
      throw new Error('Not authenticated');
    }
    return Promise.resolve(2540.75);
  }
}

// Mock of the useAdaTreeStore
export const useAdaTreeStore = {
  getState: () => ({
    setCredentials: jest.fn(),
    clearCredentials: jest.fn()
  })
}; 