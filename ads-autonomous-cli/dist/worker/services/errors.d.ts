/**
 * Error handling & logging utilities for Worker
 */
export declare enum ErrorType {
    SCRAPING_FAILED = "SCRAPING_FAILED",
    SCRAPING_TIMEOUT = "SCRAPING_TIMEOUT",
    SCRAPING_RATE_LIMIT = "SCRAPING_RATE_LIMIT",
    AI_FAILED = "AI_FAILED",
    AI_RATE_LIMIT = "AI_RATE_LIMIT",
    AI_TIMEOUT = "AI_TIMEOUT",
    KV_FAILED = "KV_FAILED",
    INVALID_INPUT = "INVALID_INPUT",
    UNKNOWN = "UNKNOWN"
}
export declare class WorkerError extends Error {
    type: ErrorType;
    message: string;
    retryable: boolean;
    details?: Record<string, any> | undefined;
    constructor(type: ErrorType, message: string, retryable?: boolean, details?: Record<string, any> | undefined);
    toJSON(): {
        type: ErrorType;
        message: string;
        retryable: boolean;
        details: Record<string, any> | undefined;
    };
}
/**
 * Logger with request context
 */
export declare class ContextLogger {
    private requestId;
    private startTime;
    constructor(requestId?: string);
    private getPrefix;
    info(message: string, data?: Record<string, any>): void;
    warn(message: string, data?: Record<string, any>): void;
    error(message: string, error?: Error | WorkerError, data?: Record<string, any>): void;
    step(stepNumber: number, stepName: string, data?: Record<string, any>): void;
    success(message: string, data?: Record<string, any>): void;
    getRequestId(): string;
}
/**
 * Error factory functions
 */
export declare function createScrapingError(message: string, original?: Error, retryable?: boolean): WorkerError;
export declare function createScrapingTimeoutError(): WorkerError;
export declare function createAIError(message: string, original?: Error, retryable?: boolean): WorkerError;
export declare function createAITimeoutError(): WorkerError;
export declare function createAIRateLimitError(): WorkerError;
export declare function createKVError(message: string, original?: Error): WorkerError;
export declare function createInputError(message: string): WorkerError;
/**
 * Format error message for user
 */
export declare function formatErrorMessage(error: WorkerError | Error): string;
//# sourceMappingURL=errors.d.ts.map