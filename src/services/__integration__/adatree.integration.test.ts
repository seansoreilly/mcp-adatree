import { AdaTreeService } from '../adatree';

// Mock the adatree module
jest.mock('../adatree');

describe('AdaTree API Integration Tests', () => {
  let adaTreeService: AdaTreeService;
  
  beforeEach(() => {
    // Reset the singleton instance before each test
    // @ts-ignore - accessing private property for testing
    AdaTreeService.instance = undefined;
    
    adaTreeService = AdaTreeService.getInstance();

    const credentials = {
      cdrArrangementId: 'mock-cdr-id',
      consentId: 'mock-consent-id',
      consumerId: 'mock-consumer-id'
    };

    adaTreeService.setCredentials(credentials);
  });

  describe('Transactions API', () => {
    it('should return an array of transactions', async () => {
      const transactions = await adaTreeService.getTransactions({
        fromDate: '2023-06-01',
        toDate: '2023-06-30',
        pageSize: 10
      });
      
      expect(Array.isArray(transactions)).toBe(true);
      expect(transactions.length).toBeGreaterThan(0);
    });

    it('should have correct transaction properties', async () => {
      const transactions = await adaTreeService.getTransactions();
      
      const transaction = transactions[0];
      expect(transaction).toHaveProperty('transactionId');
      expect(transaction).toHaveProperty('amount');
      expect(transaction).toHaveProperty('description');
      expect(transaction).toHaveProperty('transactionDate');
      expect(transaction).toHaveProperty('type');
      expect(transaction).toHaveProperty('status');
    });
  });

  describe('Account Balance API', () => {
    it('should fetch account balance', async () => {
      const balance = await adaTreeService.getAccountBalance();
      
      expect(typeof balance).toBe('number');
    });
  });
}); 