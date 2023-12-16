import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import { Wallet } from '@swapkit/sdk';

interface WalletContextInterface {
  isWalletConnected: boolean | null;
  setIsWalletConnected: Dispatch<SetStateAction<boolean>>;
  connectedChains: Wallet | null;
  setConnectedChains: Dispatch<SetStateAction<Wallet | null>>;
}

const initialState: WalletContextInterface = {
  isWalletConnected: false,
  setIsWalletConnected: () => null,
  connectedChains: null,
  setConnectedChains: () => null,
};

export const WalletContext =
  createContext<WalletContextInterface>(initialState);

interface WalletProviderProps {
  /**
   * The children components of the provider
   */
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [connectedChains, setConnectedChains] = useState<Wallet | null>(null);

  return (
    <WalletContext.Provider
      value={{
        isWalletConnected,
        setIsWalletConnected,
        connectedChains,
        setConnectedChains,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
