import { useContext, useEffect, useState } from 'react';
import { Box, CircularProgress, Skeleton } from '@mui/material';
import CoinHeader from '../components/CoinHeader';
import CoinChart from '../components/CoinChart';
import CoinInfoBox from '../components/CoinInfoBox';
import CoinTable from '../components/CoinTable';
import { Coin } from '../types/Coin';
import { TimeInterval } from '../types/TimeInterval';
import { ChartMode } from '../types/ChartMode';
import { CoinContext } from '../contexts/CoinContext';

interface HomeProps {
  coins: Coin[];
  searchText: string;
}

const Home = ({ coins, searchText }: HomeProps) => {
  const {
    selectedCoin,
    setSelectedCoin,
    liveCoinWatchData,
    fetchLiveCoinWatch,
  } = useContext(CoinContext);
  const [timeInterval, setTimeInterval] = useState<TimeInterval>('24hr');
  const [chartMode, setChartMode] = useState<ChartMode>('price');

  useEffect(() => {
    fetchLiveCoinWatch('BTC', '24hr');
  }, []);

  const handleCoinClick = (coin: Coin) => {
    setSelectedCoin(coin);
    fetchLiveCoinWatch(coin.symbol, timeInterval);
  };

  const handleIntervalClick = (newInterval: TimeInterval) => {
    setTimeInterval(newInterval);
    fetchLiveCoinWatch(selectedCoin?.symbol || 'BTC', newInterval);
  };

  if (!coins.length)
    return (
      <Box mx={2} display="flex">
        <Skeleton width="70vw" height="100vh" />;
        <Skeleton width="30vw" height="100vh" />;
      </Box>
    );

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
              sx={{
                m: { xs: 0, md: 1 },
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
