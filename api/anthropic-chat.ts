import type { ProxyRequestBody } from '../lib/server/anthropic.js';
import { runAnthropicChat } from '../lib/server/anthropic.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const payload: ProxyRequestBody = req.body ?? {};
    const apiKey =
      process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY || '';
    const reply = await runAnthropicChat(payload, apiKey);
    res.status(200).json({ reply });
  } catch (error: any) {
    console.error('Anthropic proxy error:', error);
    const message = error?.message ?? 'Unknown error';
    res.status(500).json({ error: message });
  }
}
