/**
 * Error handling & logging utilities for Worker
 */

export enum ErrorType {
  SCRAPING_FAILED = 'SCRAPING_FAILED',
  SCRAPING_TIMEOUT = 'SCRAPING_TIMEOUT',
  SCRAPING_RATE_LIMIT = 'SCRAPING_RATE_LIMIT',
  AI_FAILED = 'AI_FAILED',
  AI_RATE_LIMIT = 'AI_RATE_LIMIT',
  AI_TIMEOUT = 'AI_TIMEOUT',
  KV_FAILED = 'KV_FAILED',
  INVALID_INPUT = 'INVALID_INPUT',
  UNKNOWN = 'UNKNOWN'
}

export class WorkerError extends Error {
  constructor(
    public type: ErrorType,
    public message: string,
    public retryable: boolean = false,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'WorkerError';
  }

  toJSON() {
    return {
      type: this.type,
      message: this.message,
      retryable: this.retryable,
      details: this.details
    };
  }
}

/**
 * Logger with request context
 */
export class ContextLogger {
  private requestId: string;
  private startTime: number;

  constructor(requestId: string = crypto.randomUUID().substring(0, 8)) {
    this.requestId = requestId;
    this.startTime = Date.now();
  }

  private getPrefix(): string {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    return `[${this.requestId}:${elapsed}s]`;
  }

  info(message: string, data?: Record<string, any>) {
    const log = data ? { message, ...data } : message;
    console.log(`${this.getPrefix()} ℹ️ ${JSON.stringify(log)}`);
  }

  warn(message: string, data?: Record<string, any>) {
    const log = data ? { message, ...data } : message;
    console.warn(`${this.getPrefix()} ⚠️ ${JSON.stringify(log)}`);
  }

  error(message: string, error?: Error | WorkerError, data?: Record<string, any>) {
    const errorData = error instanceof WorkerError
      ? error.toJSON()
      : { message: error?.message || 'Unknown error' };

    const log = data
      ? { message, error: errorData, ...data }
      : { message, error: errorData };

    console.error(`${this.getPrefix()} ❌ ${JSON.stringify(log)}`);
  }

  step(stepNumber: number, stepName: string, data?: Record<string, any>) {
    this.info(`Step ${stepNumber}: ${stepName}`, data);
  }

  success(message: string, data?: Record<string, any>) {
    const log = data ? { message, ...data } : message;
    console.log(`${this.getPrefix()} ✅ ${JSON.stringify(log)}`);
  }

  getRequestId(): string {
    return this.requestId;
  }
}

/**
 * Error factory functions
 */
export function createScrapingError(message: string, original?: Error, retryable: boolean = true): WorkerError {
  return new WorkerError(
    ErrorType.SCRAPING_FAILED,
    `Scraping failed: ${message}`,
    retryable,
    { original: original?.message }
  );
}

export function createScrapingTimeoutError(): WorkerError {
  return new WorkerError(
    ErrorType.SCRAPING_TIMEOUT,
    'Scraping timed out. Using fallback data.',
    true
  );
}

export function createAIError(message: string, original?: Error, retryable: boolean = true): WorkerError {
  return new WorkerError(
    ErrorType.AI_FAILED,
    `AI generation failed: ${message}`,
    retryable,
    { original: original?.message }
  );
}

export function createAITimeoutError(): WorkerError {
  return new WorkerError(
    ErrorType.AI_TIMEOUT,
    'AI generation timed out after 3 retries',
    true
  );
}

export function createAIRateLimitError(): WorkerError {
  return new WorkerError(
    ErrorType.AI_RATE_LIMIT,
    'AI service rate limit reached. Waiting before retry.',
    true
  );
}

export function createKVError(message: string, original?: Error): WorkerError {
  return new WorkerError(
    ErrorType.KV_FAILED,
    `Database error: ${message}`,
    false,
    { original: original?.message }
  );
}

export function createInputError(message: string): WorkerError {
  return new WorkerError(
    ErrorType.INVALID_INPUT,
    message,
    false
  );
}

/**
 * Format error message for user
 */
export function formatErrorMessage(error: WorkerError | Error): string {
  if (error instanceof WorkerError) {
    switch (error.type) {
      case ErrorType.SCRAPING_FAILED:
        return 'Failed to scrape competitor ads. Please try again.';
      case ErrorType.SCRAPING_TIMEOUT:
        return 'Scraping took too long. Using cached competitor data instead.';
      case ErrorType.SCRAPING_RATE_LIMIT:
        return 'Scraping service is busy. Please wait and try again.';
      case ErrorType.AI_FAILED:
        return 'AI generation failed. Please try again.';
      case ErrorType.AI_RATE_LIMIT:
        return 'AI service is busy. Please wait and try again.';
      case ErrorType.AI_TIMEOUT:
        return 'AI generation took too long. Please try again.';
      case ErrorType.KV_FAILED:
        return 'Failed to save campaign. Please try again.';
      case ErrorType.INVALID_INPUT:
        return error.message;
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  return 'An unexpected error occurred. Please try again.';
}
