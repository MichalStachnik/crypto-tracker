// import { Chain, WalletOption, createSwapKit, SwapKitCore } from '@swapkit/sdk';
// import { Chain } from '@swapkit/sdk';
import { Chain, SwapKitCore, EVMWalletOptions } from '@swapkit/core';
import { xdefiWallet } from '@swapkit/wallet-xdefi';
import { evmWallet } from '@swapkit/wallet-evm-extensions';

// export const swapKitClient = createSwapKit({
//   config: {
//     ethplorerApiKey: import.meta.env.VITE_ETHPLORER_KEY,
//     blockchairApiKey: import.meta.env.VITE_BLOCKCHAIR_KEY,
//   },
// });

// const connectChains = [Chain.Ethereum, Chain.Bitcoin, Chain.THORChain];
export const connectChains = [Chain.Ethereum, Chain.Bitcoin];
export const connectEVMChains = [Chain.Ethereum];

// export const connectWallet = (walletOption: WalletOption, phrase?: string) => {
//   switch (walletOption) {
//     case WalletOption.KEYSTORE: {
//       return swapKitClient.connectKeystore(connectChains, phrase || '');
//     }

//     case WalletOption.XDEFI:
//       return swapKitClient.connectXDEFI(connectChains);

//     case WalletOption.WALLETCONNECT:
//       return swapKitClient.connectWalletconnect(connectChains);

//     case WalletOption.METAMASK:
//       return swapKitClient.connectEVMWallet(
//         connectEVMChains,
//         WalletOption.METAMASK
//       );

//     default:
//       break;
//   }
// };

export const client = new SwapKitCore();
client.extend({
  wallets: [xdefiWallet, evmWallet],
  config: {
    ethplorerApiKey: import.meta.env.VITE_ETHPLORER_KEY,
    blockchairApiKey: import.meta.env.VITE_BLOCKCHAIR_KEY,
  },
});

export const connectXDEFI = async () => {
  const res = await client.connectXDEFI(connectChains);
  return res;
};

export const connectEVMWallet = async (wallet: EVMWalletOptions) => {
  const res = await client.connectEVMWallet(connectEVMChains, wallet);
  return res;
};

export const getConnectedChains = () => {
  const res = client.connectedChains;
  return res;
};

export const fetchWalletBalances = async () => {
  const wallets = await Promise.all(
    connectChains.map((chain) => client.getWalletByChain(chain))
  );
  return wallets;
};
