import { formatPostDate } from "~/services/bluesky";
import type { ParsedFilm } from "~/services/bluesky";

interface ListingCardProps {
  film: ParsedFilm;
  postDate: string;
  marketSlug: string;
}

export function ListingCard({ film, postDate, marketSlug }: ListingCardProps) {
  const formattedDate = formatPostDate(postDate);
  const draftHouseUrl = `https://drafthouse.com/austin/theater/${marketSlug}`;

  return (
    <li>
      <p className="release-date">Since {formattedDate}</p>
      <a href={draftHouseUrl} target="_blank" rel="noopener noreferrer">
        <h2>{film.title} &raquo;</h2>
        {film.hasAddlTimes && <h3>ADDITIONAL TIMES!</h3>}
      </a>
    </li>
  );
}
