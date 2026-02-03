# Alamo Alerts Client

> A React Router v7 app that displays the latest films available at select Alamo Drafthouse locations.
> Visit the app @ www.alamoalerts.com

## Stack

- **Framework:** React Router v7 with SSR
- **Runtime:** Cloudflare Workers
- **Database:** Cloudflare D1 (caching)
- **Styling:** Tailwind CSS v4
- **Data Source:** Bluesky API
- **Build:** Vite

## Development

```bash
# Install dependencies
npm install

# Start dev server (runs on Cloudflare Workers runtime locally)
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck
```

## Deployment

### First-time Setup

1. **Create D1 Database:**
   ```bash
   wrangler d1 create alamo-alerts-cache
   ```

2. **Update `wrangler.jsonc`** with your database ID:
   ```json
   "d1_databases": [{
     "binding": "DB",
     "database_name": "alamo-alerts-cache",
     "database_id": "<YOUR_DATABASE_ID>"
   }]
   ```

3. **Run migrations:**
   ```bash
   wrangler d1 execute alamo-alerts-cache --file=./migrations/0001_create_post_cache.sql
   ```

### Deploy

```bash
npm run deploy
```

This builds the app and deploys to Cloudflare Workers.

## Project Structure

```
app/
├── components/       # React components
├── config/          # Market configuration
├── routes/          # React Router routes
├── services/        # Bluesky & TMDB API clients
└── styles/          # Legacy CSS
public/              # Static assets
workers/             # Cloudflare Worker entry
migrations/          # D1 database migrations
```

## Markets

The app supports these Alamo Drafthouse Austin locations:

| Location | Bluesky Handle |
|----------|----------------|
| Village | @alamoalerts003.bsky.social |
| South Lamar | @alamoalerts004.bsky.social |
| Slaughter Lane | @alamoalerts006.bsky.social |
| Lakeline | @alamoalerts007.bsky.social |
| Mueller | @alamoalerts008.bsky.social |

## Overview

The Alamo Alerts client fetches posts from Bluesky accounts that announce new ticket availability at various Alamo Drafthouse locations. Posts are cached in D1 for 5 minutes to reduce API calls. Users can follow the Bluesky accounts or subscribe via RSS for notifications.
