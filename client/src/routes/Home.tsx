/* eslint-disable no-constant-condition */
import { useContext, useState } from 'react';
import { Box, CircularProgress, Skeleton } from '@mui/material';
import CoinHeader from '../components/CoinHeader';
import CoinChart from '../components/CoinChart';
import CoinInfoBox from '../components/CoinInfoBox';
import CoinTable from '../components/CoinTable';
import { CoinContext } from '../contexts/CoinContext';
import { Coin } from '../types/Coin';
import { TimeInterval } from '../types/TimeInterval';
import { ChartMode } from '../types/ChartMode';

const Home = () => {
  const { coins, selectedCoin, liveCoinWatchData, fetchLiveCoinWatch } =
    useContext(CoinContext);
  const [timeInterval, setTimeInterval] = useState<TimeInterval>('24hr');
  const [chartMode, setChartMode] = useState<ChartMode>('price');

  const handleCoinClick = (coin: Coin) => {
    fetchLiveCoinWatch(coin.symbol, timeInterval);
  };

  const handleIntervalClick = (newInterval: TimeInterval) => {
    setTimeInterval(newInterval);
    fetchLiveCoinWatch(selectedCoin?.symbol || 'BTC', newInterval);
  };

  if (!coins.length) {
    return (
      <Box
        mx={2}
        display="flex"
        justifyContent="space-between"
        gap={2}
        component="div"
      >
        <Skeleton width="100%" height="100vh" />
        <Skeleton width="340px" height="100vh" />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" component="div">
      <Box component="div">
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
              component="div"
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
      <Box p={2} component="div">
        <CoinTable coins={coins} onCoinClick={handleCoinClick} />
      </Box>
    </Box>
  );
};

export default Home;
