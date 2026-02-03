import { fetchAndParsePosts, type ParsedPost } from "./bluesky";

const FIVE_MINUTES = 5 * 60 * 1000;

interface CachedData {
  posts: string;
  fetched_at: number;
}

export interface CachedPostsResult {
  posts: ParsedPost[];
  stale: boolean;
  cachedAt: string | null;
}

/**
 * Fetch Bluesky posts with D1 caching
 * Uses a 5-minute TTL with stale-while-revalidate pattern
 */
export async function fetchBlueskyPostsCached(
  db: D1Database | null,
  marketSlug: string,
  handle: string
): Promise<CachedPostsResult> {
  const now = Date.now();

  // If no DB available, fetch directly
  if (!db) {
    const posts = await fetchAndParsePosts(handle);
    return { posts, stale: false, cachedAt: null };
  }

  // Check cache
  try {
    const cached = await db
      .prepare('SELECT posts, fetched_at FROM post_cache WHERE market = ?')
      .bind(marketSlug)
      .first<CachedData>();

    if (cached && (now - cached.fetched_at) < FIVE_MINUTES) {
      // Cache is fresh
      return {
        posts: JSON.parse(cached.posts),
        stale: false,
        cachedAt: new Date(cached.fetched_at).toISOString(),
      };
    }

    // Cache is stale or doesn't exist, fetch fresh data
    try {
      const posts = await fetchAndParsePosts(handle);

      // Update cache
      await db
        .prepare('INSERT OR REPLACE INTO post_cache (market, posts, fetched_at) VALUES (?, ?, ?)')
        .bind(marketSlug, JSON.stringify(posts), now)
        .run();

      return {
        posts,
        stale: false,
        cachedAt: new Date(now).toISOString(),
      };
    } catch (fetchError) {
      // Fetch failed, return stale cache if available
      if (cached) {
        console.warn('Using stale cache due to fetch error:', fetchError);
        return {
          posts: JSON.parse(cached.posts),
          stale: true,
          cachedAt: new Date(cached.fetched_at).toISOString(),
        };
      }
      throw fetchError;
    }
  } catch (dbError) {
    // DB error, try to fetch directly
    console.error('D1 cache error:', dbError);
    const posts = await fetchAndParsePosts(handle);
    return { posts, stale: false, cachedAt: null };
  }
}
