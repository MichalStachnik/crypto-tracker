import { useEffect, useState } from 'react';
import './App.css';
import { CircularProgress, Typography } from '@mui/material';
import CoinTable from './components/CoinTable';
import CoinChart from './components/CoinChart';
import { Coin } from './types/Coin';
import { LiveCoinWatchData } from './types/LiveCoinWatchData';

function App() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [liveCoinWatchData, setLiveCoinWatchData] =
    useState<LiveCoinWatchData | null>(null);
  useEffect(() => {
    // fetch('/api/global')
    //   .then((res) => res.json())
    //   .then((res) => console.log('our res', res))
    //   .catch((err) => console.log('our err', err));
    fetchCMC();
    fetchLiveCoinWatch('BTC');
  }, []);

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
    setSelectedCoin(coin);
    fetchLiveCoinWatch(coin.symbol);
  };
  if (!coins.length) return <CircularProgress />;
  return (
    <div>
      <h1>Crypto Tracker</h1>
      {liveCoinWatchData ? (
        <>
          <Typography>
            24 hour price data for {selectedCoin?.name || 'Bitcoin'}
          </Typography>
          <CoinChart liveCoinWatchData={liveCoinWatchData} />
        </>
      ) : null}
      <CoinTable coins={coins} onCoinClick={handleCoinClick} />
    </div>
  );
}

export default App;
