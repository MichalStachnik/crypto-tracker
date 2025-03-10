import { AssetValue, WalletOption } from '@swapkit/sdk';

export interface UserWallet {
  address?: string | undefined;
  balance?: AssetValue[] | undefined;
  walletType?: WalletOption | undefined;
}
