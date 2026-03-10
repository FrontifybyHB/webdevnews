# WebDev Times 🗞️

A newspaper-style web development & AI news dashboard powered by **Google Gemini AI**.

## Features

- **Real-time AI news** — Gemini fetches fresh web dev & AI news every session
- **Hinglish style** — Hindi-English mix headlines for Indian developers  
- **Smart caching** — localStorage caches news for 30 minutes to avoid repeated API calls
- **Category filters** — Filter by AI Models, Dev Tools, Frontend, Backend, Design, Strategy
- **Load More** — Fetch additional batches of news with a single click
- **Dark editorial UI** — Beautiful newspaper-aesthetic dark theme

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS v4
- **AI**: Google Gemini API (`gemini-1.5-flash`)
- **Language**: TypeScript

## Setup

### 1. Get a Gemini API Key

Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and create a free API key.

### 2. Configure Environment

Open `.env.local` and replace the placeholder:

```
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_key_here
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  page.tsx           # Hero/Landing page
  news/page.tsx      # News Dashboard
  layout.tsx         # Root layout + fonts
components/
  HeroPage.tsx       # Landing page with background fetch
  NewsCard.tsx       # Individual news card
  NewsDashboard.tsx  # News grid + filters + pagination
  NewsModal.tsx      # Full article popup
  LoadingSkeletons.tsx
lib/
  gemini.ts          # Gemini API integration
  cache.ts           # localStorage cache helpers
types/
  news.ts            # TypeScript interfaces
```

## How It Works

1. **Hero page loads** → triggers background Gemini API call  
2. **Status badge** shows 🔴 fetching → 🟢 ready  
3. **Click "Read Today's News"** → News page reads from localStorage  
4. **Category pills** filter client-side (no extra API calls)  
5. **Load More** fetches next 10 stories from Gemini (with skip prompt)  
6. **Cache expires** after 30 minutes → fresh fetch on next visit

## Notes

- No backend server required — all API calls are client-side
- No database — news is fetched fresh each session (cached in browser)
- API key is exposed client-side (prefixed `NEXT_PUBLIC_`) as this is a client-only app
