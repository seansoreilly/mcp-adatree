import { create } from 'zustand';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category?: string;
}

interface TransactionState {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  clearTransactions: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) => 
    set((state) => ({ 
      transactions: [...state.transactions, transaction] 
    })),
  clearTransactions: () => set({ transactions: [] }),
}));

export class StorageService {
  private static instance: StorageService;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  storeTransactions(transactions: Transaction[]) {
    useTransactionStore.getState().setTransactions(transactions);
  }

  getTransactions(): Transaction[] {
    return useTransactionStore.getState().transactions;
  }

  validateTransaction(transaction: Transaction): boolean {
    return (
      typeof transaction.id === 'string' &&
      typeof transaction.amount === 'number' &&
      typeof transaction.description === 'string' &&
      typeof transaction.date === 'string'
    );
  }
} 