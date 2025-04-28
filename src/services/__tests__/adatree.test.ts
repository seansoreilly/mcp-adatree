import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AdaTreeService, handleError } from '../adatree';

describe('AdaTreeService', () => {
  let mockAxios: MockAdapter;
  let adaTreeService: AdaTreeService;

  beforeEach(() => {
    // Reset the singleton instance before each test
    // @ts-ignore - accessing private property for testing
    AdaTreeService.instance = undefined;
    
    adaTreeService = AdaTreeService.getInstance();
    // @ts-ignore - accessing private property for testing
    mockAxios = new MockAdapter(adaTreeService.axiosInstance);

    // Set up test credentials
    adaTreeService.setCredentials({
      cdrArrangementId: 'test-cdr-id',
      consentId: 'test-consent-id',
      consumerId: 'test-consumer-id'
    });
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('should fetch transactions successfully', async () => {
    // Mock data
    const mockTransactions = {
      data: [
        {
          transactionId: 'tx123',
          amount: 100.50,
          description: 'Test Transaction',
          transactionDate: '2024-03-20',
          type: 'DEBIT',
          status: 'POSTED'
        }
      ],
      metadata: {
        totalRecords: 1,
        pageSize: 100,
        pageNumber: 1
      }
    };

    // Setup mock response
    mockAxios.onGet('/transactions').reply(200, mockTransactions);

    // Test the getTransactions method
    const transactions = await adaTreeService.getTransactions({
      fromDate: '2024-03-20',
      toDate: '2024-03-20'
    });

    // Assertions
    expect(transactions).toHaveLength(1);
    expect(transactions[0]).toEqual(mockTransactions.data[0]);
  });
  
  it('should handle API errors correctly', async () => {
    // Setup mock response for 401 error
    mockAxios.onGet('/transactions').reply(401, { error: 'Unauthorized' });
    
    // Test that the getTransactions method throws correctly
    await expect(adaTreeService.getTransactions()).rejects.toThrow('Authentication failed');
    
    // Setup mock response for 429 error
    mockAxios.reset();
    mockAxios.onGet('/transactions').reply(429, { error: 'Too many requests' });
    
    await expect(adaTreeService.getTransactions()).rejects.toThrow('Rate limit exceeded');
  });
  
  it('should handle generic errors correctly', async () => {
    // Setup mock response for a generic error
    mockAxios.onGet('/transactions').reply(500, { error: 'Server error' });
    
    // Test that the error is passed through
    await expect(adaTreeService.getTransactions()).rejects.toThrow();
  });
  
  describe('handleError function', () => {
    it('should format 401 errors correctly', () => {
      const axiosError = {
        response: {
          status: 401,
          data: { message: 'Invalid credentials' }
        }
      };
      
      expect(() => handleError(axiosError)).toThrow('Unauthorized: Please check your credentials');
    });
    
    it('should format API errors with response data', () => {
      const axiosError = {
        response: {
          status: 400,
          data: { message: 'Invalid request' }
        }
      };
      
      expect(() => handleError(axiosError)).toThrow('API Error:');
    });
    
    it('should pass through non-axios errors', () => {
      const genericError = new Error('Generic error');
      expect(() => handleError(genericError)).toThrow('Generic error');
    });
  });
}); 