import Anthropic from '@anthropic-ai/sdk';

const MODEL_NAME = 'claude-3-5-sonnet-20241022';

export interface ProxyMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ProxyRequestBody {
  systemPrompt?: string;
  messages?: ProxyMessage[];
}

export async function runAnthropicChat(
  payload: ProxyRequestBody,
  apiKey: string,
): Promise<string> {
  if (!apiKey) {
    throw new Error('Anthropic API key is not configured on the server.');
  }

  const { systemPrompt, messages } = payload;

  if (!systemPrompt || !Array.isArray(messages)) {
    throw new Error('Invalid request payload.');
  }

  const anthropic = new Anthropic({ apiKey });

  const response = await anthropic.messages.create({
    model: MODEL_NAME,
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const textReply = response.content
    .filter(block => block.type === 'text')
    .map(block => ('text' in block ? block.text : ''))
    .join('')
    .trim();

  if (!textReply) {
    throw new Error('Assistant did not return any text.');
  }

  return textReply;
}
