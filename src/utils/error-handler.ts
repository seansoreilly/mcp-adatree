export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AdaTreeError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(message, 'ADATREE_ERROR', originalError);
    this.name = 'AdaTreeError';
  }
}

export class StorageError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(message, 'STORAGE_ERROR', originalError);
    this.name = 'StorageError';
  }
}

export function handleError(error: Error): AppError {
  if (error instanceof AppError) {
    return error;
  }

  // Log the error for debugging
  console.error('Unhandled error:', error);

  // Return a generic error
  return new AppError(
    'An unexpected error occurred',
    'UNKNOWN_ERROR',
    error
  );
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
} 