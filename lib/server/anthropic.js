import Anthropic from '@anthropic-ai/sdk';

const DEFAULT_MODEL = 'claude-3-5-sonnet-20240620';
const MODEL_NAME = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

export async function runAnthropicChat(payload, apiKey) {
  if (!apiKey) {
    throw new Error('Anthropic API key is not configured on the server.');
  }

  const { systemPrompt, messages } = payload ?? {};

  if (!systemPrompt || !Array.isArray(messages)) {
    throw new Error('Invalid request payload.');
  }

  const anthropic = new Anthropic({ apiKey });

  const formattedMessages = messages.map(message => {
    const textBlocks = Array.isArray(message.content)
      ? message.content
          .filter(
            block =>
              !!block &&
              block.type === 'text' &&
              typeof block.text === 'string',
          )
          .map(block => ({ type: 'text', text: block.text }))
      : [];

    if (typeof message.content === 'string') {
      return {
        role: message.role,
        content: [{ type: 'text', text: message.content }],
      };
    }

    if (textBlocks.length === 0) {
      const fallbackText = Array.isArray(message.content)
        ? message.content
            .map(block =>
              typeof block === 'object' && block && 'text' in block
                ? String(block.text)
                : '',
            )
            .filter(Boolean)
            .join('\n')
        : '';

      if (!fallbackText) {
        throw new Error('Message content is empty.');
      }

      return {
        role: message.role,
        content: [{ type: 'text', text: fallbackText }],
      };
    }

    return { role: message.role, content: textBlocks };
  });

  let response;

  try {
    response = await anthropic.messages.create({
      model: MODEL_NAME,
      max_tokens: 1024,
      system: systemPrompt,
      messages: formattedMessages,
    });
  } catch (error) {
    const notFoundType = error?.error?.error?.type || error?.error?.type;
    if (notFoundType === 'not_found_error') {
      throw new Error(
        `Anthropic model "${MODEL_NAME}" is not available. Update ANTHROPIC_MODEL to a model your key can access.`,
      );
    }

    throw error;
  }

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
