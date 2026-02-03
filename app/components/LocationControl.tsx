import { useState } from "react";
import { Link } from "react-router";
import { MARKET_LIST, type Market } from "~/config/markets";

interface LocationControlProps {
  activeMarket: Market;
}

export function LocationControl({ activeMarket }: LocationControlProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`location-control-container ${isOpen ? 'open' : ''}`}>
      <div className="control">
        <p className="header">Select a Location</p>
        <h1 className="active-option" onClick={() => setIsOpen(true)}>
          {activeMarket.name} <span className="icon-expand"></span>
        </h1>
      </div>
      <div className="list" onClick={() => setIsOpen(false)}>
        <ul>
          {MARKET_LIST.map((market) => (
            <Link to={`/${market.slug}`} key={market.slug}>
              <li>
                <h1 className={market.slug === activeMarket.slug ? 'active' : ''}>
                  {market.name}
                </h1>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}
