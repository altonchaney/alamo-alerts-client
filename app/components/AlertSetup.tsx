import { useState } from "react";
import type { Market } from "~/config/markets";

interface AlertSetupProps {
  market: Market;
}

export function AlertSetup({ market }: AlertSetupProps) {
  const [isOpen, setIsOpen] = useState(false);

  const blueskyUrl = `https://bsky.app/profile/${market.handle}`;
  // RSS feed URL using Bluesky's RSS bridge
  const rssUrl = `https://bsky.app/profile/${market.handle}/rss`;

  return (
    <div className={`alert-setup-container ${isOpen ? 'open' : ''}`}>
      <div className="background" onClick={() => setIsOpen(false)} />
      <div className="content" onClick={() => !isOpen && setIsOpen(true)}>
        <div className="alert">
          <div className="button-content">
            <span className="icon"></span> SET UP ALERT
          </div>
        </div>
        <ul className="alert-options">
          <li className="bluesky">
            <a href={blueskyUrl} target="_blank" rel="noopener noreferrer">
              <button className="button-content">
                <span className="icon"></span> BLUESKY
              </button>
            </a>
            <p className="description">
              Follow {market.name}'s Bluesky account to get alerts in your feed.
            </p>
          </li>
          <li className="rss">
            <a href={rssUrl} target="_blank" rel="noopener noreferrer">
              <button className="button-content">
                <span className="icon"></span> RSS FEED
              </button>
            </a>
            <p className="description">
              Subscribe to {market.name}'s RSS feed for updates.
            </p>
          </li>
        </ul>
      </div>
      <p className="close-modal" onClick={() => setIsOpen(false)}>
        &times; CLOSE THIS
      </p>
    </div>
  );
}
