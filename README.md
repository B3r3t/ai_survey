# AI in Franchising Survey

A modern, interactive survey application built with React, TypeScript, and Vite to collect insights about AI adoption in the franchising industry.

## Features

- 15 comprehensive survey sections covering AI usage, tools, investment, ROI, and more
- Integrated AI chatbot assistant powered by Anthropic Claude
- Progress tracking and validation
- Responsive design with Tailwind CSS
- CSV export of survey responses

## Run Locally

**Prerequisites:** Node.js 18+

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**

   Create a `.env.local` file with the keys needed by both the frontend and the serverless proxy:

   ```ini
   ANTHROPIC_API_KEY=your_actual_api_key_here
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your_public_anon_key
   VITE_SURVEY_VERSION=1
   ```

   **⚠️ IMPORTANT SECURITY NOTE:**
   - Never commit your API key to git
   - Revoke and regenerate your key if it's ever exposed
   - The app proxies chatbot traffic through `/api/anthropic-chat` so the Anthropic key stays on the server

3. **Run the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

4. **Build for production:**
   ```bash
   npm run build
   ```

## Deploy to Vercel

### Environment Variables

In your Vercel project settings, add the following environment variables:

- `ANTHROPIC_API_KEY` – Anthropic Claude API key for the serverless proxy
- `VITE_SUPABASE_URL` – Supabase project URL
- `VITE_SUPABASE_ANON_KEY` – Supabase anon (public) key
- `VITE_SURVEY_VERSION` – Optional version string stored with each response

### Deployment

The app is configured to deploy automatically to Vercel when you push to the `main` branch. The `vercel.json` routing table keeps `/api/*` paths pointing at their serverless functions (such as `/api/anthropic-chat`) while every other request falls back to `index.html` for the single-page app shell.

**⚠️ Important:**

- Ensure your Supabase project has the `survey_responses` table defined in [`supabase/schema.sql`](supabase/schema.sql) before deploying.
- See `CODEBASE_REVIEW.md` for critical security recommendations before deploying to production.

## Tech Stack

- **React** 19.2.0
- **TypeScript** 5.8.2
- **Vite** 6.2.0
- **Tailwind CSS** (CDN)
- **Anthropic Claude** (@anthropic-ai/sdk)
- **Lucide React** (icons)

## Project Structure

```
├── App.tsx              # Main application component
├── components/          # React components
│   ├── Chatbot.tsx     # AI assistant
│   ├── ProgressBar.tsx # Progress tracking
│   └── WelcomeScreen.tsx # Completion screen
├── types.ts            # TypeScript definitions
├── constants.ts        # Survey sections and data
├── vite.config.ts      # Vite configuration
└── vercel.json         # Vercel deployment config
```

## Documentation

- **CODEBASE_REVIEW.md** - Comprehensive code review and security audit

## License

Private
