import Anthropic from '@anthropic-ai/sdk';

const MODEL_NAME = 'claude-3-5-sonnet-20241022';

export interface ProxyMessage {
  role: 'user' | 'assistant';
  content: string | { type: 'text'; text: string }[];
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

  const formattedMessages = messages.map(message => {
    const textBlocks = Array.isArray(message.content)
      ? message.content
          .filter(
            (block): block is { type: 'text'; text: string } =>
              !!block && block.type === 'text' && typeof block.text === 'string'
          )
          .map(block => ({ type: 'text' as const, text: block.text }))
      : [];

    if (typeof message.content === 'string') {
      return {
        role: message.role,
        content: [{ type: 'text' as const, text: message.content }],
      };
    }

    if (textBlocks.length === 0) {
      const fallbackText = Array.isArray(message.content)
        ? message.content
            .map(block =>
              typeof block === 'object' && block && 'text' in block
                ? String(block.text)
                : ''
            )
            .filter(Boolean)
            .join('\n')
        : '';

      if (!fallbackText) {
        throw new Error('Message content is empty.');
      }

      return {
        role: message.role,
        content: [{ type: 'text' as const, text: fallbackText }],
      };
    }

    return { role: message.role, content: textBlocks };
  });

  const response = await anthropic.messages.create({
    model: MODEL_NAME,
    max_tokens: 1024,
    system: systemPrompt,
    messages: formattedMessages,
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
