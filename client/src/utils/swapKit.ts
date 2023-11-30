import { Chain, WalletOption, createSwapKit } from '@swapkit/sdk';

export const swapKitClient = createSwapKit({
  config: {
    ethplorerApiKey: import.meta.env.VITE_ETHPLORER_KEY,
    blockchairApiKey: import.meta.env.VITE_BLOCKCHAIR_KEY,
  },
});

// const connectChains = [Chain.Ethereum, Chain.Bitcoin, Chain.THORChain];
export const connectChains = [Chain.Ethereum, Chain.Bitcoin];
export const connectEVMChains = [Chain.Ethereum];

export const connectWallet = (walletOption: WalletOption, phrase?: string) => {
  switch (walletOption) {
    case WalletOption.KEYSTORE: {
      return swapKitClient.connectKeystore(connectChains, phrase || '');
    }

    case WalletOption.XDEFI:
      return swapKitClient.connectXDEFI(connectChains);

    case WalletOption.WALLETCONNECT:
      return swapKitClient.connectWalletconnect(connectChains);

    case WalletOption.METAMASK:
      return swapKitClient.connectEVMWallet(
        connectEVMChains,
        WalletOption.METAMASK
      );

    default:
      break;
  }
};
