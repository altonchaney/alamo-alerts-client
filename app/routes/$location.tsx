import { useLoaderData } from "react-router";
import type { Route } from "./+types/$location";
import { MARKETS, type Market } from "~/config/markets";
import { fetchRandomMovieBackdrop } from "~/services/tmdb";
import { fetchBlueskyPostsCached } from "~/services/bluesky-cached";
import type { ParsedPost } from "~/services/bluesky";
import { HeroBanner } from "~/components/HeroBanner";
import { LocationControl } from "~/components/LocationControl";
import { AlertSetup } from "~/components/AlertSetup";
import { ListingCard } from "~/components/ListingCard";
import { LoadingState } from "~/components/LoadingState";
import { FeedFooter } from "~/components/FeedFooter";

interface LoaderData {
  market: Market;
  heroImage: string;
  posts: ParsedPost[];
  stale: boolean;
  error?: string;
}

export async function loader({ params, context }: Route.LoaderArgs): Promise<LoaderData> {
  const locationSlug = params.location;
  const market = MARKETS[locationSlug as keyof typeof MARKETS];

  if (!market) {
    throw new Response('Market not found', { status: 404 });
  }

  // Get environment variables from Cloudflare context
  const env = (context as any).cloudflare?.env;
  const tmdbApiKey = env?.TMDB_API_KEY || '69e93151bbb7ee3e03a532dd2995da45';
  const db = env?.DB as D1Database | undefined;

  // Fetch hero image and posts in parallel
  const [heroImage, postsResult] = await Promise.all([
    fetchRandomMovieBackdrop(tmdbApiKey),
    fetchBlueskyPostsCached(db || null, market.slug, market.handle)
      .catch((error) => {
        console.error('Error fetching posts:', error);
        return { posts: [] as ParsedPost[], stale: false, cachedAt: null };
      }),
  ]);

  return {
    market,
    heroImage,
    posts: postsResult.posts,
    stale: postsResult.stale,
  };
}

export function meta({ data }: Route.MetaArgs) {
  const market = data?.market as Market | undefined;
  return [
    { title: market ? `Alamo Alerts - ${market.name}` : 'Alamo Alerts' },
    { name: "description", content: "Get alerted when movies go on sale at your Alamo Drafthouse location!" },
  ];
}

export default function LocationPage() {
  const { market, heroImage, posts, stale } = useLoaderData<LoaderData>();

  // Flatten all films from all posts with their dates
  const allFilms = posts.flatMap(post =>
    post.films.map(film => ({
      film,
      postDate: post.createdAt,
    }))
  );

  return (
    <div id="alamoalerts">
      <HeroBanner heroImageUrl={heroImage} />
      <section className="main">
        <div className="main-container">
          <LocationControl activeMarket={market} />
          <AlertSetup market={market} />
          <div className="main-list-container">
            <p className="header">Recently On Sale</p>
            {stale && (
              <p style={{ fontSize: '12px', opacity: 0.6, margin: '10px 0' }}>
                Posts may be outdated. Refresh to try again.
              </p>
            )}
            {allFilms.length === 0 ? (
              <p style={{ padding: '20px', opacity: 0.6 }}>
                No new listings yet. Check back soon!
              </p>
            ) : (
              <ul className="main-list">
                {allFilms.map((item, index) => (
                  <ListingCard
                    key={`${item.film.title}-${item.postDate}-${index}`}
                    film={item.film}
                    postDate={item.postDate}
                    marketSlug={market.slug}
                  />
                ))}
              </ul>
            )}
          </div>
          <FeedFooter marketSlug={market.slug} />
        </div>
      </section>
    </div>
  );
}
