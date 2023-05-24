export interface Coin {
  circulating_supply: number;
  cmc_rank: number;
  date_added: string;
  id: number;
  infinite_supply: boolean;
  last_updated: string;
  max_supply: number;
  name: string;
  num_market_pairs: number;
  platform: any;
  quote: any;
  self_reported_circulating_supply: any;
  self_reported_market_cap: any;
  slug: string;
  symbol: string;
  tags: string[];
  total_supply: number;
  tvl_ratio: any;
}
