/**
 * AI Service using Cloudflare Workers AI
 *
 * Free tier: 10,000 neurons/day — no API key needed.
 * Model: llama-3.1-8b-instruct (fast, capable for marketing copy)
 *
 * Docs: https://developers.cloudflare.com/workers-ai/
 */
interface AiEnv {
    AI: Ai;
}
export declare function generateWithCloudfareAI(prompt: string, systemPrompt: string, env: AiEnv): Promise<string>;
/**
 * Retry wrapper dengan exponential backoff
 */
export declare function generateWithRetry(prompt: string, systemPrompt: string, env: AiEnv, maxRetries?: number): Promise<string>;
export {};
//# sourceMappingURL=ai.d.ts.map