/**
 * AI Service using Google Gemini API
 * 
 * Gemini Pro is cost-effective and fast:
 * - $0.00025 per 1k characters input
 * - $0.0005 per 1k characters output
 * 
 * For comparison:
 * - OpenAI GPT-4: $0.03 per 1k tokens
 * - Claude: $0.08 per 1k tokens
 */

interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    topK?: number;
  };
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
  }>;
}

export async function generateWithGemini(
  prompt: string,
  systemPrompt: string,
  apiKey: string,
  temperature: number = 0.7
): Promise<string> {
  console.log('Generating with Gemini...');
  
  try {
    const fullPrompt = `${systemPrompt}\n\n${prompt}`;
    
    const request: GeminiRequest = {
      contents: [{
        parts: [{ text: fullPrompt }]
      }],
      generationConfig: {
        temperature,
        maxOutputTokens: 2048,
        topP: 0.95,
        topK: 40
      }
    };
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${error}`);
    }
    
    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini');
    }
    
    const result = data.candidates[0].content.parts[0].text;
    console.log(`Generated ${result.length} characters`);
    
    return result;
  } catch (error) {
    console.error('Gemini generation error:', error);
    throw error;
  }
}

/**
 * Retry wrapper for AI generation with exponential backoff
 */
export async function generateWithRetry(
  prompt: string,
  systemPrompt: string,
  apiKey: string,
  maxRetries: number = 3
): Promise<string> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await generateWithGemini(prompt, systemPrompt, apiKey);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.error(`Attempt ${attempt} failed:`, lastError.message);
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('All retry attempts failed');
}
