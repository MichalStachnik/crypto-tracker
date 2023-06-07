import { Box, CircularProgress, Typography } from '@mui/material';
import { Coin } from '../types/Coin';
import { LiveCoinWatchData } from '../types/LiveCoinWatchData';

interface CoinHeaderProps {
  selectedCoin: Coin | null;
  liveCoinWatchData: LiveCoinWatchData | null;
  isLoading: boolean;
}

const CoinHeader = ({
  selectedCoin,
  liveCoinWatchData,
  isLoading,
}: CoinHeaderProps) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      {isLoading && <CircularProgress />}
      <Typography ml={2} display="inline">
        {isLoading ? 'fetching' : ''} 24 hour price data for
      </Typography>
      &nbsp;
      <Box bgcolor="white" display="inline" p="8px" borderRadius="4px">
        <Typography
          display="inline"
          fontWeight="bold"
          fontSize="1.2rem"
          color={liveCoinWatchData ? liveCoinWatchData.color : 'black'}
        >
          {liveCoinWatchData?.name || selectedCoin?.name}
        </Typography>
      </Box>
    </Box>
  );
};

export default CoinHeader;
