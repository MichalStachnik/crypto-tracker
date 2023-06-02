import { useEffect, useState } from 'react';
import './App.css';
import { Box, CircularProgress, Typography } from '@mui/material';
import CoinTable from './components/CoinTable';
import CoinChart from './components/CoinChart';
import { Coin } from './types/Coin';
import { LiveCoinWatchData } from './types/LiveCoinWatchData';
import Header from './components/Header';
import { UserProvider } from './contexts/UserContext';

function App() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [globalData, setGlobalData] = useState({});
  const [liveCoinWatchData, setLiveCoinWatchData] =
    useState<LiveCoinWatchData | null>(null);
  const [searchText, setSearchText] = useState('');

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
      .catch((err) => console.error('Error', err));
  };

  const handleCoinClick = (coin: Coin) => {
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
        <div>
          {liveCoinWatchData ? (
            <>
              <Typography display="inline">24 hour price data for</Typography>
              &nbsp;
              <Box bgcolor="white" display="inline" p="4px" border="8px">
                <Typography display="inline" color={liveCoinWatchData.color}>
                  {liveCoinWatchData.name}
                </Typography>
              </Box>
              <CoinChart liveCoinWatchData={liveCoinWatchData} />
            </>
          ) : null}
          <CoinTable
            coins={coins}
            onCoinClick={handleCoinClick}
            searchText={searchText}
          />
        </div>
      </UserProvider>
    </>
  );
}

export default App;
