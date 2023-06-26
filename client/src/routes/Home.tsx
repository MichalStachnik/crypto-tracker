import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import CoinHeader from '../components/CoinHeader';
import CoinChart from '../components/CoinChart';
import CoinInfoBox from '../components/CoinInfoBox';
import CoinTable from '../components/CoinTable';
import { Coin } from '../types/Coin';
import { LiveCoinWatchData } from '../types/LiveCoinWatchData';
import { TimeInterval } from '../types/TimeInterval';
import { ChartMode } from '../types/ChartMode';

interface HomeProps {
  coins: Coin[];
  searchText: string;
}

const Home = ({ coins, searchText }: HomeProps) => {
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [liveCoinWatchData, setLiveCoinWatchData] =
    useState<LiveCoinWatchData | null>(null);
  const [timeInterval, setTimeInterval] = useState<TimeInterval>('24hr');
  const [chartMode, setChartMode] = useState<ChartMode>('price');

  useEffect(() => {
    fetchLiveCoinWatch('BTC', '24hr');
  }, []);

  const fetchLiveCoinWatch = (symbol: string, interval: TimeInterval) => {
    fetch(`/api/livecoinwatch/${symbol}/${interval}`)
      .then((res) => res.json())
      .then((res) => setLiveCoinWatchData(res))
      .catch((err) => console.error('Error', err));
  };

  const handleCoinClick = (coin: Coin) => {
    setSelectedCoin(coin);
    fetchLiveCoinWatch(coin.symbol, timeInterval);
  };

  const handleIntervalClick = (newInterval: TimeInterval) => {
    setTimeInterval(newInterval);
    fetchLiveCoinWatch(selectedCoin?.symbol || 'BTC', newInterval);
  };

  if (!coins.length) return <CircularProgress />;
  return (
    <Box display="flex" flexDirection="column">
      <Box>
        <CoinHeader
          selectedCoin={selectedCoin}
          liveCoinWatchData={liveCoinWatchData}
          timeInterval={timeInterval}
          onIntervalClick={handleIntervalClick}
          chartMode={chartMode}
          setChartMode={setChartMode}
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
                chartMode={chartMode}
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
  );
};

export default Home;
