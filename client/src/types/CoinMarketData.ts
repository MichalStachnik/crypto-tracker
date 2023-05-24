export interface CoinMarketData {
  price_close: number;
  price_high: number;
  price_low: number;
  price_open: number;
  time_close: string;
  time_open: string;
  time_period_end: string;
  time_period_start: string;
  trades_count: number;
  volume_traded: number;
}
