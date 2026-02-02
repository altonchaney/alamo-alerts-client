# Alamo Alerts Client Migration Design

**Date:** 2026-02-02
**Status:** Approved

## Overview

Migrate the Alamo Alerts Client from Vue.js + Express on Heroku to React Router v7 with SSR on Cloudflare Workers. Replace Twitter embeds with Bluesky API integration while preserving all existing styling and animations.

## Goals

1. Port from Heroku to Cloudflare (Workers + D1)
2. Migrate from Vue.js to React Router v7
3. Replace Twitter with Bluesky as data source
4. Restore inline listings (currently commented out)
5. Remove embedded Twitter feed elements
6. Preserve all existing CSS styling and animations exactly

## Non-Goals

- Consolidating alamo-alerts-bot (stays separate for posting)
- Redesigning the UI (preserve current look exactly)
- Adding new features beyond the migration scope

---

## Architecture

### Stack

| Layer | Technology |
|-------|------------|
| Framework | React Router v7 with SSR |
| Runtime | Cloudflare Workers |
| Database | Cloudflare D1 (caching) |
| Styling | Tailwind CSS + preserved legacy CSS |
| Build | Vite |
| Language | TypeScript |

### Directory Structure

```
alamo-alerts-client/
├── app/
│   ├── routes/
│   │   ├── _index.tsx              # Redirects to /mueller
│   │   ├── $location.tsx           # Main listing page
│   │   └── api.posts.$market.ts    # Bluesky API server route
│   ├── components/
│   │   ├── Header.tsx              # Logo section
│   │   ├── HeroBanner.tsx          # Movie backdrop
│   │   ├── LocationControl.tsx     # Market dropdown
│   │   ├── AlertSetup.tsx          # Alert options modal
│   │   ├── ListingCard.tsx         # Individual post item
│   │   ├── LoadingState.tsx        # Skeleton loader
│   │   └── FeedFooter.tsx          # Bottom CTA
│   ├── services/
│   │   ├── bluesky.ts              # Bluesky API client
│   │   └── tmdb.ts                 # Movie backdrop fetcher
│   ├── styles/
│   │   └── legacy.css              # Preserved original CSS
│   ├── root.tsx                    # App shell
│   └── tailwind.css                # Tailwind imports + legacy
├── public/
│   ├── favicon.ico
│   ├── logo-yellow.svg
│   ├── icon-dropdown.svg
│   ├── icon-alert.svg
│   ├── icon-rss.svg
│   └── sample-header-background.jpg
├── wrangler.toml                   # Cloudflare config
├── tailwind.config.ts              # Tailwind customization
├── package.json
└── tsconfig.json
```

---

## Routing

### Routes

| Path | Purpose |
|------|---------|
| `/` | Redirects to `/mueller` (default market) |
| `/:location` | Main listing view |
| `/api/posts/:market` | Server route returning Bluesky posts |

### Market Configuration

```typescript
export const MARKETS = {
  'village':        { id: '0003', handle: 'alamoalerts0003.bsky.social', name: 'Village' },
  'south-lamar':    { id: '0004', handle: 'alamoalerts0004.bsky.social', name: 'South Lamar' },
  'slaughter-lane': { id: '0006', handle: 'alamoalerts0006.bsky.social', name: 'Slaughter Lane' },
  'lakeline':       { id: '0007', handle: 'alamoalerts0007.bsky.social', name: 'Lakeline' },
  'mueller':        { id: '0008', handle: 'alamoalerts0008.bsky.social', name: 'Mueller' },
} as const;
```

### Loader Pattern

```typescript
// app/routes/$location.tsx
export async function loader({ params, context }: LoaderFunctionArgs) {
  const market = MARKETS[params.location as keyof typeof MARKETS];
  if (!market) throw new Response('Not Found', { status: 404 });

  const [posts, heroImage] = await Promise.all([
    fetchBlueskyPosts(context.env.DB, market.handle),
    fetchRandomMovieBackdrop(context.env.TMDB_API_KEY),
  ]);

  return { market, posts, heroImage };
}
```

---

## Bluesky Integration

### Public API (No Auth Required)

```typescript
// app/services/bluesky.ts
const BSKY_PUBLIC_API = 'https://public.api.bsky.app/xrpc';

export async function fetchBlueskyPosts(handle: string, limit = 20) {
  const url = `${BSKY_PUBLIC_API}/app.bsky.feed.getAuthorFeed`;
  const params = new URLSearchParams({
    actor: handle,
    limit: String(limit),
    filter: 'posts_no_replies'
  });

  const response = await fetch(`${url}?${params}`);
  if (!response.ok) throw new Error('Failed to fetch posts');

  const data = await response.json();

  return data.feed.map((item: any) => ({
    text: item.post.record.text,
    createdAt: item.post.record.createdAt,
    uri: item.post.uri,
  }));
}
```

### Post Parsing

The bot posts in format:
```
Now On Sale:
- Film Name
- Another Film [Addl Times]
```

Parser:
```typescript
export interface ParsedFilm {
  title: string;
  hasAddlTimes: boolean;
}

export function parseAlertPost(text: string): ParsedFilm[] {
  const lines = text.split('\n').filter(line => line.startsWith('- '));

  return lines.map(line => {
    const hasAddlTimes = line.includes('[Addl Times]');
    const title = line
      .replace('- ', '')
      .replace('[Addl Times]', '')
      .trim();
    return { title, hasAddlTimes };
  });
}
```

### Caching Strategy

5-minute TTL cache in D1:

```typescript
export async function fetchBlueskyPostsCached(
  db: D1Database,
  market: string,
  handle: string
) {
  // Check cache
  const cached = await db
    .prepare('SELECT posts, fetched_at FROM post_cache WHERE market = ?')
    .bind(market)
    .first<{ posts: string; fetched_at: number }>();

  const now = Date.now();
  const FIVE_MINUTES = 5 * 60 * 1000;

  if (cached && (now - cached.fetched_at) < FIVE_MINUTES) {
    return { posts: JSON.parse(cached.posts), stale: false };
  }

  // Fetch fresh
  try {
    const posts = await fetchBlueskyPosts(handle);

    await db
      .prepare('INSERT OR REPLACE INTO post_cache (market, posts, fetched_at) VALUES (?, ?, ?)')
      .bind(market, JSON.stringify(posts), now)
      .run();

    return { posts, stale: false };
  } catch (error) {
    // Return stale cache on error
    if (cached) {
      return { posts: JSON.parse(cached.posts), stale: true };
    }
    throw error;
  }
}
```

---

## Styling

### Approach: Tailwind + Preserved Legacy CSS

All existing CSS will be preserved exactly in `app/styles/legacy.css`. Tailwind will be used for layout utilities and any new elements, but core visual styling remains unchanged.

### Preserved CSS Features

**Keyframe Animations:**
- `wiggle` - Subtle rotation on list item hover (1deg oscillation)
- `loader` - Gradient shimmer for skeleton loading state

**Color Palette:**
- Primary yellow: `#EABB31`
- Black: `#000`
- White: `#FFF`
- Bluesky blue: `#0085FF` (replacing Twitter `#1DA1F2`)
- RSS orange: `#F26522`

**Typography:**
- Font family: `"Lato", "Roboto", "San Francisco", "Helvetica Neue"`
- Antialiased rendering
- Specific letter-spacing values throughout

**Interactive States:**
- Button hover: `translateY(-2px)` with enhanced shadow
- Button active: `translateY(1px)` with reduced shadow
- List item hover: `wiggle` animation

**Layout Patterns:**
- Hero: 200px mobile, 260px desktop
- Desaturated background image with 0.2 opacity
- Location dropdown with expand/collapse transitions
- Alert modal with background overlay (0.8 opacity)
- Responsive grid at 760px breakpoint

### Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'alamo-yellow': '#EABB31',
        'bluesky-blue': '#0085FF',
        'rss-orange': '#F26522',
      },
      fontFamily: {
        sans: ['Lato', 'Roboto', 'San Francisco', 'Helvetica Neue', 'sans-serif'],
      },
      animation: {
        wiggle: 'wiggle 200ms ease-in-out',
        loader: 'loader 1s ease infinite',
      },
      keyframes: {
        wiggle: {
          '0%': { transform: 'rotate(1deg)' },
          '25%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
          '75%': { transform: 'rotate(-1deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        loader: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
```

### CSS Import Structure

```css
/* app/tailwind.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import preserved legacy styles */
@import './styles/legacy.css';
```

The legacy CSS file will contain the full original `main.css` with only these modifications:
- Twitter blue (`#1DA1F2`) changed to Bluesky blue (`#0085FF`)
- Twitter icon references updated to Bluesky
- Asset paths updated for new directory structure

---

## Cloudflare Configuration

### Wrangler Config

```toml
# wrangler.toml
name = "alamo-alerts"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

main = "build/server/index.js"
assets = { directory = "build/client" }

[[d1_databases]]
binding = "DB"
database_name = "alamo-alerts-cache"
database_id = "<generated-on-create>"

[vars]
TMDB_API_KEY = "69e93151bbb7ee3e03a532dd2995da45"
```

### D1 Schema

```sql
CREATE TABLE IF NOT EXISTS post_cache (
  market TEXT PRIMARY KEY,
  posts TEXT NOT NULL,
  fetched_at INTEGER NOT NULL
);
```

### Environment Type

```typescript
// app/env.d.ts
interface Env {
  DB: D1Database;
  TMDB_API_KEY: string;
}

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    env: Env;
  }
}
```

---

## Error Handling

### Invalid Market

```typescript
// Returns 404 with friendly message
if (!MARKETS[params.location]) {
  throw new Response('Market not found', { status: 404 });
}
```

### Bluesky API Failure

1. Return cached posts if available (even stale)
2. Show "Posts may be outdated" indicator in UI
3. If no cache, show "Unable to load posts" message

### TMDB API Failure

Fall back to static default banner (`sample-header-background.jpg`).

### Empty Feed

Show message: "No new listings yet. Check back soon!"

---

## Migration Steps

### Phase 1: Project Setup
1. Initialize React Router v7 project with Cloudflare template
2. Configure Tailwind with custom theme
3. Copy legacy CSS to `app/styles/legacy.css`
4. Copy static assets to `public/`

### Phase 2: Core Components
5. Build Header component
6. Build HeroBanner component with TMDB integration
7. Build LocationControl dropdown (preserve animations)
8. Build Navigation between markets

### Phase 3: Bluesky Integration
9. Implement Bluesky service
10. Create server route for posts API
11. Implement D1 caching layer
12. Build post parsing logic

### Phase 4: Listings Display
13. Build ListingCard component
14. Build LoadingState skeleton
15. Build main listing page with loader
16. Restore inline listings UI

### Phase 5: Cleanup & Deploy
17. Configure wrangler.toml
18. Create D1 database
19. Remove old Vue/Express files
20. Deploy to Cloudflare Workers

### Files to Remove

After migration is complete:
- `src/` (Vue components, main.js)
- `build/` (Webpack config)
- `config/` (Webpack config)
- `client.js` (Express server)
- `routes/` (Express routes)
- `bin/` (Legacy entry point)
- `test/` (Vue tests)

### Files to Preserve

- `static/` assets (move to `public/`)
- `src/assets/` (move to `public/`)
- Git history
- `README.md` (update for new stack)

---

## Post-Migration

- **alamo-alerts-server**: Can be archived (functionality replaced)
- **alamo-alerts-bot**: Continues running separately (posts to Bluesky)
- **This project**: Displays posts from Bluesky, deployed on Cloudflare
