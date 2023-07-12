import { createContext, Dispatch, ReactNode, useState } from 'react';
import { Coin } from '../types/Coin';
import { TimeInterval } from '../types/TimeInterval';
import { LiveCoinWatchData } from '../types/LiveCoinWatchData';

interface CoinContextInterface {
  selectedCoin: Coin | null;
  setSelectedCoin: Dispatch<React.SetStateAction<Coin | null>>;
  liveCoinWatchData: LiveCoinWatchData | null;
  fetchLiveCoinWatch: any;
}

const initialState: CoinContextInterface = {
  selectedCoin: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSelectedCoin: () => {},
  liveCoinWatchData: null,
  fetchLiveCoinWatch: null,
};

export const CoinContext = createContext<CoinContextInterface>(initialState);

interface CoinProviderProps {
  /**
   * The children components of the provider
   */
  children: ReactNode;
}

export const CoinProvider = ({ children }: CoinProviderProps) => {
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [liveCoinWatchData, setLiveCoinWatchData] =
    useState<LiveCoinWatchData | null>(null);

  const fetchLiveCoinWatch = (symbol: string, interval: TimeInterval) => {
    fetch(`/api/livecoinwatch/${symbol}/${interval}`)
      .then((res) => res.json())
      .then((res) => setLiveCoinWatchData(res))
      .catch((err) => console.error('Error', err));
  };

  return (
    <CoinContext.Provider
      value={{
        selectedCoin,
        setSelectedCoin,
        liveCoinWatchData,
        fetchLiveCoinWatch,
      }}
    >
      {children}
    </CoinContext.Provider>
  );
};
