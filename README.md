# AI in Franchising Survey

A modern, interactive survey application built with React, TypeScript, and Vite to collect insights about AI adoption in the franchising industry.

## Features

- 15 comprehensive survey sections covering AI usage, tools, investment, ROI, and more
- Integrated AI chatbot assistant powered by Anthropic Claude
- **Auto-save functionality** - Progress automatically saved to Supabase
- **Resume capability** - Continue where you left off if you close the browser
- Progress tracking and validation
- Responsive design with Tailwind CSS
- Persistent storage with Supabase PostgreSQL database
- CSV export of survey responses (local backup)

## Run Locally

**Prerequisites:** Node.js 18+

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**

   Create a `.env.local` file in the root directory:
   ```env
   VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   **Getting Your Credentials:**
   - **Anthropic API Key**: Get from https://console.anthropic.com/settings/keys
   - **Supabase URL & Key**: Get from your Supabase project dashboard → Settings → API

   **⚠️ IMPORTANT SECURITY NOTE:**
   - Never commit `.env.local` to git (it's already in .gitignore)
   - Revoke and regenerate keys if they're ever exposed
   - The `.env.local` file should only exist on your local machine
   - For production, set these as environment variables in Vercel

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

In your Vercel project settings (Settings → Environment Variables), add the following:

| Variable Name | Description | Where to Get It |
|---------------|-------------|-----------------|
| `VITE_ANTHROPIC_API_KEY` | Anthropic Claude API key | https://console.anthropic.com/settings/keys |
| `VITE_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard → Settings → API |

**Scope:** Set all variables for Production, Preview, and Development

### Deployment

The app is configured to deploy automatically to Vercel when you push to the `main` branch.

**⚠️ Important:** See `CODEBASE_REVIEW.md` for critical security recommendations before deploying to production.

## Tech Stack

### Frontend
- **React** 19.2.0 - UI framework
- **TypeScript** 5.8.2 - Type safety
- **Vite** 6.2.0 - Build tool
- **Tailwind CSS** (CDN) - Styling

### Backend & Services
- **Supabase** (@supabase/supabase-js) - PostgreSQL database & real-time
- **Anthropic Claude** (@anthropic-ai/sdk) - AI chatbot assistant
- **Lucide React** - Icon library

## Project Structure

```
├── App.tsx                 # Main application component
├── components/             # React components
│   ├── Chatbot.tsx        # AI assistant
│   ├── ProgressBar.tsx    # Progress tracking
│   └── WelcomeScreen.tsx  # Completion screen
├── types.ts               # TypeScript definitions
├── constants.ts           # Survey sections and data
├── database.ts            # Supabase integration & data mapping
├── supabaseClient.ts      # Supabase client configuration
├── vite.config.ts         # Vite configuration
├── vercel.json            # Vercel deployment config
└── .env.local             # Environment variables (not in repo)
```

## Database Schema

The application uses Supabase PostgreSQL with the following table:

**Table: `survey_responses`**
- Stores all survey responses with auto-save
- Tracks progress, completion status, and timestamps
- Maps camelCase app fields to snake_case database columns
- See `database.ts` for complete field mapping

## Documentation

- **CODEBASE_REVIEW.md** - Comprehensive code review and security audit

## License

Private
