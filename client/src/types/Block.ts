export interface Block {
  bits: number;
  block_index: number;
  fee: number;
  hash: string;
  height: number;
  main_chain: boolean;
  mrkl_root: string;
  n_tx: number;
  next_block: Block[];
  none: number;
  prev_block: string;
  size: number;
  time: number;
  tx: any[];
  ver: number;
  weight: number;
}
