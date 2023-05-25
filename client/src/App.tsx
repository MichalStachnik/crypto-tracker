import { useEffect, useState } from 'react';
import './App.css';
import { CircularProgress, Typography } from '@mui/material';
import CoinTable from './components/CoinTable';
import CoinChart from './components/CoinChart';
import { Coin } from './types/Coin';
import { CoinMarketData } from './types/CoinMarketData';

function App() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [selectedCoinData, setSelectedCoinData] = useState<
    CoinMarketData[] | null
  >(null);
  useEffect(() => {
    // fetch('/api/global')
    //   .then((res) => res.json())
    //   .then((res) => console.log('our res', res))
    //   .catch((err) => console.log('our err', err));
    fetchCMC();
    fetchCoinAPI('BTC');
  }, []);

  const fetchCMC = () => {
    fetch('/api/cmc')
      .then((res) => res.json())
      .then((res) => setCoins(res.data))
      .catch((err) => console.error('Error', err));
  };

  const fetchCoinAPI = (symbol: string) => {
    fetch(`/api/coin/${symbol}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setSelectedCoinData(null);
          return;
        }
        setSelectedCoinData(res);
      })
      .catch((err) => console.error('Error', err));
  };

  const handleCoinClick = (coin: Coin) => {
    setSelectedCoin(coin);
    fetchCoinAPI(coin.symbol);
  };
  if (!coins.length) return <CircularProgress />;
  return (
    <div>
      <h1>Crypto Tracker</h1>
      {selectedCoinData ? (
        <>
          <Typography>
            24 hour price data for {selectedCoin?.name || 'Bitcoin'}
          </Typography>
          <CoinChart selectedCoinData={selectedCoinData} />
        </>
      ) : null}
      <CoinTable coins={coins} onCoinClick={handleCoinClick} />
    </div>
  );
}

export default App;
