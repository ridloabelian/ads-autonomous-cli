/**
 * Error handling & logging utilities for Worker
 */
export var ErrorType;
(function (ErrorType) {
    ErrorType["SCRAPING_FAILED"] = "SCRAPING_FAILED";
    ErrorType["SCRAPING_TIMEOUT"] = "SCRAPING_TIMEOUT";
    ErrorType["SCRAPING_RATE_LIMIT"] = "SCRAPING_RATE_LIMIT";
    ErrorType["AI_FAILED"] = "AI_FAILED";
    ErrorType["AI_RATE_LIMIT"] = "AI_RATE_LIMIT";
    ErrorType["AI_TIMEOUT"] = "AI_TIMEOUT";
    ErrorType["KV_FAILED"] = "KV_FAILED";
    ErrorType["INVALID_INPUT"] = "INVALID_INPUT";
    ErrorType["UNKNOWN"] = "UNKNOWN";
})(ErrorType || (ErrorType = {}));
export class WorkerError extends Error {
    constructor(type, message, retryable = false, details) {
        super(message);
        this.type = type;
        this.message = message;
        this.retryable = retryable;
        this.details = details;
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
    constructor(requestId = crypto.randomUUID().substring(0, 8)) {
        this.requestId = requestId;
        this.startTime = Date.now();
    }
    getPrefix() {
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
        return `[${this.requestId}:${elapsed}s]`;
    }
    info(message, data) {
        const log = data ? { message, ...data } : message;
        console.log(`${this.getPrefix()} ℹ️ ${JSON.stringify(log)}`);
    }
    warn(message, data) {
        const log = data ? { message, ...data } : message;
        console.warn(`${this.getPrefix()} ⚠️ ${JSON.stringify(log)}`);
    }
    error(message, error, data) {
        const errorData = error instanceof WorkerError
            ? error.toJSON()
            : { message: error?.message || 'Unknown error' };
        const log = data
            ? { message, error: errorData, ...data }
            : { message, error: errorData };
        console.error(`${this.getPrefix()} ❌ ${JSON.stringify(log)}`);
    }
    step(stepNumber, stepName, data) {
        this.info(`Step ${stepNumber}: ${stepName}`, data);
    }
    success(message, data) {
        const log = data ? { message, ...data } : message;
        console.log(`${this.getPrefix()} ✅ ${JSON.stringify(log)}`);
    }
    getRequestId() {
        return this.requestId;
    }
}
/**
 * Error factory functions
 */
export function createScrapingError(message, original, retryable = true) {
    return new WorkerError(ErrorType.SCRAPING_FAILED, `Scraping failed: ${message}`, retryable, { original: original?.message });
}
export function createScrapingTimeoutError() {
    return new WorkerError(ErrorType.SCRAPING_TIMEOUT, 'Scraping timed out. Using fallback data.', true);
}
export function createAIError(message, original, retryable = true) {
    return new WorkerError(ErrorType.AI_FAILED, `AI generation failed: ${message}`, retryable, { original: original?.message });
}
export function createAITimeoutError() {
    return new WorkerError(ErrorType.AI_TIMEOUT, 'AI generation timed out after 3 retries', true);
}
export function createAIRateLimitError() {
    return new WorkerError(ErrorType.AI_RATE_LIMIT, 'AI service rate limit reached. Waiting before retry.', true);
}
export function createKVError(message, original) {
    return new WorkerError(ErrorType.KV_FAILED, `Database error: ${message}`, false, { original: original?.message });
}
export function createInputError(message) {
    return new WorkerError(ErrorType.INVALID_INPUT, message, false);
}
/**
 * Format error message for user
 */
export function formatErrorMessage(error) {
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
//# sourceMappingURL=errors.js.map