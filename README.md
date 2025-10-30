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

   Create a `.env.local` file and add your Anthropic API key:
   ```
   VITE_ANTHROPIC_API_KEY=your_actual_api_key_here
   ```

   **⚠️ IMPORTANT SECURITY NOTE:**
   - Never commit your API key to git
   - Revoke and regenerate your key if it's ever exposed
   - For production, use a backend proxy instead of client-side API calls

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

In your Vercel project settings, add the following environment variable:

- **Name:** `VITE_ANTHROPIC_API_KEY`
- **Value:** Your Anthropic Claude API key
- **Scope:** Production, Preview, Development

### Deployment

The app is configured to deploy automatically to Vercel when you push to the `main` branch.

**⚠️ Important:** See `CODEBASE_REVIEW.md` for critical security recommendations before deploying to production.

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
