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

export async function generateWithCloudfareAI(
  prompt: string,
  systemPrompt: string,
  env: AiEnv
): Promise<string> {
  console.log('Generating with Cloudflare AI...');

  const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
    max_tokens: 2048,
    temperature: 0.7,
  });

  // response bisa berupa stream atau object biasa
  if (typeof response === 'object' && 'response' in response) {
    const text = (response as { response: string }).response;
    console.log(`Generated ${text.length} characters`);
    return text;
  }

  throw new Error('Unexpected response format from Cloudflare AI');
}

/**
 * Retry wrapper dengan exponential backoff
 */
export async function generateWithRetry(
  prompt: string,
  systemPrompt: string,
  env: AiEnv,
  maxRetries: number = 3
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await generateWithCloudfareAI(prompt, systemPrompt, env);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.error(`Attempt ${attempt} failed:`, lastError.message);

      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('All retry attempts failed');
}
