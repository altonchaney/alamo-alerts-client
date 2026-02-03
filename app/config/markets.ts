export interface Market {
  id: string;
  handle: string;
  name: string;
  slug: string;
}

export const MARKETS: Record<string, Market> = {
  'village': {
    id: '003',
    handle: 'alamoalerts003.bsky.social',
    name: 'Village',
    slug: 'village',
  },
  'south-lamar': {
    id: '004',
    handle: 'alamoalerts004.bsky.social',
    name: 'South Lamar',
    slug: 'south-lamar',
  },
  'slaughter-lane': {
    id: '006',
    handle: 'alamoalerts006.bsky.social',
    name: 'Slaughter Lane',
    slug: 'slaughter-lane',
  },
  'lakeline': {
    id: '007',
    handle: 'alamoalerts007.bsky.social',
    name: 'Lakeline',
    slug: 'lakeline',
  },
  'mueller': {
    id: '008',
    handle: 'alamoalerts008.bsky.social',
    name: 'Mueller',
    slug: 'mueller',
  },
} as const;

export const MARKET_LIST = Object.values(MARKETS);

export const DEFAULT_MARKET = 'mueller';
