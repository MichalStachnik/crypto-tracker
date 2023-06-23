export interface Transaction {
  block_height: number;
  block_index: number;
  double_spend: boolean;
  fee: number;
  hash: string;
  inputs: any[];
  lock_time: number;
  out: any[];
  relayed_by: string;
  size: number;
  time: number;
  tx_index: number;
  ver: number;
  vin_sz: number;
  vout_sz: number;
  weight: number;
}
