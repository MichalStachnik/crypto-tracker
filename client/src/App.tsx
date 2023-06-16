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
import { TimeInterval } from './types/TimeInterval';

function App() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [globalData, setGlobalData] = useState({});
  const [liveCoinWatchData, setLiveCoinWatchData] =
    useState<LiveCoinWatchData | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [timeInterval, setTimeInterval] = useState<TimeInterval>('24hr');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchGlobal();
    fetchCMC();
    fetchLiveCoinWatch('BTC', '24hr');
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

  const fetchLiveCoinWatch = (symbol: string, interval: TimeInterval) => {
    fetch(`/api/livecoinwatch/${symbol}/${interval}`)
      .then((res) => res.json())
      .then((res) => setLiveCoinWatchData(res))
      .catch((err) => console.error('Error', err))
      .finally(() => setIsLoading(false));
  };

  const handleCoinClick = (coin: Coin) => {
    setIsLoading(true);
    setSelectedCoin(coin);
    fetchLiveCoinWatch(coin.symbol, timeInterval);
  };

  const handleIntervalClick = (newInterval: TimeInterval) => {
    setTimeInterval(newInterval);
    setIsLoading(true);
    fetchLiveCoinWatch(selectedCoin?.symbol || 'BTC', newInterval);
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
              timeInterval={timeInterval}
              onIntervalClick={handleIntervalClick}
            />
            {liveCoinWatchData ? (
              <>
                <Box
                  display="flex"
                  m={2}
                  sx={{
                    flexDirection: { xs: 'column', md: 'row' },
                  }}
                >
                  <CoinChart
                    liveCoinWatchData={liveCoinWatchData}
                    timeInterval={timeInterval}
                  />
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
