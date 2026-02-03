import type { Route } from "./+types/api.posts.$market";
import { MARKETS } from "~/config/markets";
import { fetchBlueskyPostsCached } from "~/services/bluesky-cached";

export async function loader({ params, context }: Route.LoaderArgs) {
  const marketSlug = params.market;
  const market = MARKETS[marketSlug as keyof typeof MARKETS];

  if (!market) {
    return Response.json(
      { error: 'Market not found' },
      { status: 404 }
    );
  }

  try {
    // Get D1 database from Cloudflare context (may be undefined in dev)
    const db = (context as any).cloudflare?.env?.DB as D1Database | undefined;

    const result = await fetchBlueskyPostsCached(
      db || null,
      market.slug,
      market.handle
    );

    return Response.json({
      market: {
        id: market.id,
        name: market.name,
        slug: market.slug,
      },
      posts: result.posts,
      stale: result.stale,
      cachedAt: result.cachedAt,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching Bluesky posts:', error);

    return Response.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
