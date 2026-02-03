interface FeedFooterProps {
  marketSlug: string;
}

export function FeedFooter({ marketSlug }: FeedFooterProps) {
  const draftHouseUrl = `https://drafthouse.com/austin/theater/${marketSlug}`;

  return (
    <div className="feed-footer">
      <p className="disclaimer">NOTE: Ticket availability subject to change.</p>
      <a href={draftHouseUrl} target="_blank" rel="noopener noreferrer">
        <button className="button-content">SEE ALL LISTINGS</button>
      </a>
    </div>
  );
}
