-- Migration: Create post_cache table for Bluesky posts caching
-- TTL: 5 minutes (handled in application code)

CREATE TABLE IF NOT EXISTS post_cache (
  market TEXT PRIMARY KEY,
  posts TEXT NOT NULL,
  fetched_at INTEGER NOT NULL
);

-- Index for faster lookups by market
CREATE INDEX IF NOT EXISTS idx_post_cache_market ON post_cache(market);
