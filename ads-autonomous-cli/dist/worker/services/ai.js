/**
 * AI Service using Cloudflare Workers AI
 *
 * Free tier: 10,000 neurons/day — no API key needed.
 * Model: llama-3.1-8b-instruct (fast, capable for marketing copy)
 *
 * Docs: https://developers.cloudflare.com/workers-ai/
 */
import { ContextLogger, createAIError, createAITimeoutError, createAIRateLimitError } from './errors';
export async function generateWithCloudfareAI(prompt, systemPrompt, env, logger) {
    const log = logger || new ContextLogger();
    try {
        log.info('Generating with Cloudflare AI', { promptLength: prompt.length });
        const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt },
            ],
            max_tokens: 2048,
            temperature: 0.7,
        });
        if (!response) {
            throw createAIError('Empty response from AI model');
        }
        const text = response.response || response.result?.response;
        if (!text || typeof text !== 'string') {
            throw createAIError('Unexpected response format from Cloudflare AI');
        }
        log.success(`Generated ${text.length} characters`);
        return text;
    }
    catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        const message = err.message.toLowerCase();
        // Detect rate limiting
        if (message.includes('rate') || message.includes('quota') || message.includes('limit')) {
            log.warn('Rate limit detected', { error: message });
            throw createAIRateLimitError();
        }
        // Detect timeout
        if (message.includes('timeout') || message.includes('timed out')) {
            log.warn('AI request timeout', { error: message });
            throw createAITimeoutError();
        }
        log.error('AI generation error', err);
        throw createAIError(message);
    }
}
/**
 * Retry wrapper with exponential backoff
 */
export async function generateWithRetry(prompt, systemPrompt, env, maxRetries = 3, logger) {
    const log = logger || new ContextLogger();
    let lastError = null;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await generateWithCloudfareAI(prompt, systemPrompt, env, log);
            if (attempt > 1) {
                log.success(`Success on attempt ${attempt}/${maxRetries}`);
            }
            return result;
        }
        catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            if (attempt < maxRetries) {
                // Longer delay for rate limiting
                const isRateLimit = lastError.message.includes('rate');
                const delay = isRateLimit
                    ? Math.pow(3, attempt) * 1000 // Exponential backoff for rate limits: 3s, 9s, 27s
                    : Math.pow(2, attempt) * 1000; // Standard backoff: 2s, 4s, 8s
                log.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`, {
                    error: lastError.message
                });
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    log.error(`All ${maxRetries} retry attempts failed`, lastError || undefined);
    throw lastError || createAITimeoutError();
}
//# sourceMappingURL=ai.js.map