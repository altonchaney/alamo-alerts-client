const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w1280';

export interface TMDBMovie {
  backdrop_path: string | null;
  title: string;
}

export async function fetchRandomMovieBackdrop(apiKey: string): Promise<string> {
  const currentYear = new Date().getFullYear();
  const url = `${TMDB_BASE_URL}/discover/movie?api_key=${apiKey}&language=en-US&region=US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_year=${currentYear}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch movies from TMDB');
    }

    const data = await response.json() as { results?: TMDBMovie[] };
    const movies: TMDBMovie[] = data.results || [];

    // Filter movies with backdrop images
    const moviesWithBackdrops = movies.filter(m => m.backdrop_path);

    if (moviesWithBackdrops.length === 0) {
      // Fallback to default image
      return '/sample-header-background.jpg';
    }

    // Pick a random movie
    const randomIndex = Math.floor(Math.random() * Math.min(moviesWithBackdrops.length, 20));
    const selectedMovie = moviesWithBackdrops[randomIndex];

    return `${TMDB_IMAGE_BASE}${selectedMovie.backdrop_path}`;
  } catch (error) {
    console.error('TMDB API error:', error);
    // Fallback to default image
    return '/sample-header-background.jpg';
  }
}
