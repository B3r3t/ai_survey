import Anthropic from '@anthropic-ai/sdk';

const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const FALLBACK_MODELS = [
  'claude-3-5-sonnet-4',
  'claude-3-5-sonnet-latest',
  'claude-3-5-sonnet-20240620',
  'claude-3-5-haiku-latest',
  'claude-3-haiku-20240307',
];
const MODEL_NAME = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

const getModelCandidates = () => {
  const preferred = MODEL_NAME?.trim();
  const candidates = [preferred, ...FALLBACK_MODELS]
    .filter(Boolean)
    .map(name => name.trim())
    .filter(name => name.length > 0);

  return Array.from(new Set(candidates));
};

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

  const modelCandidates = getModelCandidates();

  for (const model of modelCandidates) {
    try {
      response = await anthropic.messages.create({
        model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: formattedMessages,
      });
      break;
    } catch (error) {
      const notFoundType = error?.error?.error?.type || error?.error?.type;
      if (notFoundType !== 'not_found_error') {
        throw error;
      }
    }
  }

  if (!response) {
    const triedModels = modelCandidates.join(', ');
    throw new Error(
      `Unable to access any Anthropic model. Tried: ${triedModels}. Set ANTHROPIC_MODEL to a model available to your API key.`,
    );
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
