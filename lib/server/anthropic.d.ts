export type ProxyRole = 'user' | 'assistant';

export interface ProxyMessage {
  role: ProxyRole;
  content: string | { type: 'text'; text: string }[];
}

export interface ProxyRequestBody {
  systemPrompt?: string;
  messages?: ProxyMessage[];
}

export declare function runAnthropicChat(
  payload: ProxyRequestBody,
  apiKey: string,
): Promise<string>;
