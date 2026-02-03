const BSKY_PUBLIC_API = 'https://public.api.bsky.app/xrpc';

export interface BlueskyPost {
  text: string;
  createdAt: string;
  uri: string;
}

export interface ParsedFilm {
  title: string;
  hasAddlTimes: boolean;
}

export interface ParsedPost {
  text: string;
  createdAt: string;
  uri: string;
  films: ParsedFilm[];
}

/**
 * Fetch posts from a Bluesky account using the public API (no auth required)
 */
export async function fetchBlueskyPosts(handle: string, limit = 20): Promise<BlueskyPost[]> {
  const url = `${BSKY_PUBLIC_API}/app.bsky.feed.getAuthorFeed`;
  const params = new URLSearchParams({
    actor: handle,
    limit: String(limit),
    filter: 'posts_no_replies',
  });

  const response = await fetch(`${url}?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as { feed: any[] };

  return data.feed.map((item: any) => ({
    text: item.post.record.text,
    createdAt: item.post.record.createdAt,
    uri: item.post.uri,
  }));
}

/**
 * Parse an alert post to extract film titles
 *
 * The bot posts in format:
 * Now On Sale:
 * - Film Name
 * - Another Film [Addl Times]
 */
export function parseAlertPost(text: string): ParsedFilm[] {
  const lines = text.split('\n').filter(line => line.trim().startsWith('- '));

  return lines.map(line => {
    const hasAddlTimes = line.includes('[Addl Times]');
    const title = line
      .replace(/^-\s*/, '')
      .replace('[Addl Times]', '')
      .trim();

    return { title, hasAddlTimes };
  });
}

/**
 * Fetch and parse posts from a Bluesky account
 */
export async function fetchAndParsePosts(handle: string, limit = 20): Promise<ParsedPost[]> {
  const posts = await fetchBlueskyPosts(handle, limit);

  return posts.map(post => ({
    ...post,
    films: parseAlertPost(post.text),
  }));
}

/**
 * Format a date string for display
 */
export function formatPostDate(dateString: string): string {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();

  // Add ordinal suffix
  const ordinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return `${month} ${ordinal(day)}`;
}
