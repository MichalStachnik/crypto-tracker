import { useEffect, useState } from 'react';
import './App.css';
import { Box, CircularProgress } from '@mui/material';
import CoinTable from './components/CoinTable';
import CoinChart from './components/CoinChart';
import { Coin } from './types/Coin';
import { LiveCoinWatchData } from './types/LiveCoinWatchData';
import Header from './components/Header';
import { UserProvider } from './contexts/UserContext';
import CoinInfoBox from './components/CoinInfoBox';
import CoinHeader from './components/CoinHeader';

function App() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [globalData, setGlobalData] = useState({});
  const [liveCoinWatchData, setLiveCoinWatchData] =
    useState<LiveCoinWatchData | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchGlobal();
    fetchCMC();
    fetchLiveCoinWatch('BTC');
  }, []);

  const fetchGlobal = () => {
    fetch('/api/global')
      .then((res) => res.json())
      .then((res) => setGlobalData(res))
      .catch((err) => console.error('Error', err));
  };

  const fetchCMC = () => {
    fetch('/api/cmc')
      .then((res) => res.json())
      .then((res) => setCoins(res.data))
      .catch((err) => console.error('Error', err));
  };

  const fetchLiveCoinWatch = (symbol: string) => {
    fetch(`/api/livecoinwatch/${symbol}`)
      .then((res) => res.json())
      .then((res) => setLiveCoinWatchData(res))
      .catch((err) => console.error('Error', err))
      .finally(() => setIsLoading(false));
  };

  const handleCoinClick = (coin: Coin) => {
    setIsLoading(true);
    setSelectedCoin(coin);
    fetchLiveCoinWatch(coin.symbol);
  };
  if (!coins.length) return <CircularProgress />;
  return (
    <>
      <UserProvider>
        <Header
          globalData={globalData}
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <Box display="flex" flexDirection="column">
          <Box>
            <CoinHeader
              selectedCoin={selectedCoin}
              liveCoinWatchData={liveCoinWatchData}
              isLoading={isLoading}
            />
            {liveCoinWatchData ? (
              <>
                <Box display="flex" m={2}>
                  <CoinChart liveCoinWatchData={liveCoinWatchData} />
                  <CoinInfoBox liveCoinWatchData={liveCoinWatchData} />
                </Box>
              </>
            ) : (
              <CircularProgress />
            )}
          </Box>
          <CoinTable
            coins={coins}
            onCoinClick={handleCoinClick}
            searchText={searchText}
          />
        </Box>
      </UserProvider>
    </>
  );
}

export default App;
