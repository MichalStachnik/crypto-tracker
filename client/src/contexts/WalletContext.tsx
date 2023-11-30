import { createContext, Dispatch, ReactNode, useEffect, useState } from 'react';

interface WalletContextInterface {
  isWalletConnected: boolean | null;
  setIsWalletConnected: Dispatch<React.SetStateAction<boolean>>;
}

const initialState: WalletContextInterface = {
  isWalletConnected: false,
  setIsWalletConnected: () => null,
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

  return (
    <WalletContext.Provider
      value={{
        isWalletConnected,
        setIsWalletConnected,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
