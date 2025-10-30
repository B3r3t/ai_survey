import path from 'path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { ProxyRequestBody } from './lib/server/anthropic';
import { runAnthropicChat } from './lib/server/anthropic';

const anthropicProxyPlugin = (): Plugin => ({
  name: 'anthropic-proxy',
  configureServer(server) {
    server.middlewares.use('/api/anthropic-chat', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.setHeader('Allow', 'POST');
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        return;
      }

      try {
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }

        const body = Buffer.concat(chunks).toString('utf8') || '{}';
        const payload = JSON.parse(body) as ProxyRequestBody;
        const apiKey = process.env.ANTHROPIC_API_KEY || '';
        const reply = await runAnthropicChat(payload, apiKey);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ reply }));
      } catch (error: any) {
        const message = error?.message ?? 'Unknown error';
        const statusCode = message === 'Invalid request payload.' ? 400 : 500;
        res.statusCode = statusCode;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: message }));
      }
    });
  },
});

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react(), anthropicProxyPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
});
