import { AdaTreeService } from '../adatree';

describe('AdaTree API Integration Tests', () => {
  let adaTreeService: AdaTreeService;

  beforeAll(() => {
    // Reset the singleton instance before all tests
    // @ts-ignore - accessing private property for testing
    AdaTreeService.instance = undefined;
    
    adaTreeService = AdaTreeService.getInstance();

    // Use React's environment variable naming convention
    const credentials = {
      cdrArrangementId: process.env.REACT_APP_ADATREE_CDR_ARRANGEMENT_ID || '',
      consentId: process.env.REACT_APP_ADATREE_CONSENT_ID || '',
      consumerId: process.env.REACT_APP_ADATREE_CONSUMER_ID || ''
    };

    if (!credentials.cdrArrangementId || !credentials.consentId || !credentials.consumerId) {
      throw new Error(
        'Missing required environment variables. Please set:\n' +
        '- REACT_APP_ADATREE_CDR_ARRANGEMENT_ID\n' +
        '- REACT_APP_ADATREE_CONSENT_ID\n' +
        '- REACT_APP_ADATREE_CONSUMER_ID'
      );
    }

    adaTreeService.setCredentials(credentials);
  });

  describe('Transactions API', () => {
    let transactions: any[];
    
    beforeEach(async () => {
      // Get transactions for the last 30 days
      const toDate = new Date().toISOString().split('T')[0];
      const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      transactions = await adaTreeService.getTransactions({
        fromDate,
        toDate,
        pageSize: 10
      });
    });

    it('should return an array of transactions', () => {
      expect(Array.isArray(transactions)).toBe(true);
    });

    it('should have correct transaction properties when transactions exist', () => {
      // Skip this test if no transactions are returned
      if (transactions.length === 0) {
        return;
      }

      const transaction = transactions[0];
      expect(transaction).toBeDefined();
      expect(transaction).toHaveProperty('transactionId');
      expect(transaction).toHaveProperty('amount');
      expect(transaction).toHaveProperty('description');
      expect(transaction).toHaveProperty('transactionDate');
      expect(transaction).toHaveProperty('type');
      expect(transaction).toHaveProperty('status');
    });
  });

  describe('Account Balance API', () => {
    it('should fetch real account balance', async () => {
      const balance = await adaTreeService.getAccountBalance();
      expect(typeof balance).toBe('number');
    }, 30000); // Increased timeout for API call
  });
}); 