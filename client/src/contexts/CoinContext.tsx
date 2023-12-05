/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, Dispatch, ReactNode, useEffect, useState } from 'react';
import { Coin } from '../types/Coin';
import { TimeInterval } from '../types/TimeInterval';
import { LiveCoinWatchData } from '../types/LiveCoinWatchData';

interface CoinContextInterface {
  coins: Coin[];
  setCoins: Dispatch<React.SetStateAction<Coin[]>>;
  selectedCoin: Coin | null;
  setSelectedCoin: Dispatch<React.SetStateAction<Coin | null>>;
  liveCoinWatchData: LiveCoinWatchData | null;
  fetchLiveCoinWatch: any;
  metaData: any;
}

const initialState: CoinContextInterface = {
  coins: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCoins: () => {},
  selectedCoin: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSelectedCoin: () => {},
  liveCoinWatchData: null,
  fetchLiveCoinWatch: null,
  metaData: null,
};

export const CoinContext = createContext<CoinContextInterface>(initialState);

interface CoinProviderProps {
  /**
   * The children components of the provider
   */
  children: ReactNode;
}

export const CoinProvider = ({ children }: CoinProviderProps) => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [liveCoinWatchData, setLiveCoinWatchData] =
    useState<LiveCoinWatchData | null>(null);
  const [metaData, setMetaData] = useState<any>(null);

  const fetchLiveCoinWatch = (symbol: string, interval: TimeInterval) => {
    fetch(`/api/livecoinwatch/${symbol}/${interval}`)
      .then((res) => res.json())
      .then((res) => setLiveCoinWatchData(res))
      .catch((err) => console.error('Error', err));
  };

  const fetchCMC = () => {
    fetch('/api/cmc')
      .then((res) => res.json())
      .then((res) => setCoins(res.data))
      .catch((err) => console.error('Error', err));
  };

  const fetchMetadata = () => {
    fetch('/api/cmc/metadata')
      .then((res) => res.json())
      .then((res) => setMetaData(res.data))
      .catch((err) => console.error('Error', err));
  };

  useEffect(() => {
    fetchLiveCoinWatch('BTC', '24hr');
    fetchCMC();
    fetchMetadata();
  }, []);

  return (
    <CoinContext.Provider
      value={{
        coins,
        setCoins,
        selectedCoin,
        setSelectedCoin,
        liveCoinWatchData,
        fetchLiveCoinWatch,
        metaData,
      }}
    >
      {children}
    </CoinContext.Provider>
  );
};
