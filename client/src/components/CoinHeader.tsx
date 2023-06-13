import {
  Box,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
} from '@mui/material';
import { Coin } from '../types/Coin';
import { LiveCoinWatchData } from '../types/LiveCoinWatchData';
import { TimeInterval } from '../App';

const StyledToggleButton = styled(ToggleButton)(() => ({
  color: 'white',
  '&.Mui-selected': {
    background: 'white',
  },
  ':hover': {
    background: 'white',
    color: '#1976d2',
  },
}));

interface CoinHeaderProps {
  selectedCoin: Coin | null;
  liveCoinWatchData: LiveCoinWatchData | null;
  isLoading: boolean;
  timeInterval: TimeInterval;
  onIntervalClick: (newInterval: TimeInterval) => void;
}

const CoinHeader = ({
  selectedCoin,
  liveCoinWatchData,
  isLoading,
  timeInterval,
  onIntervalClick,
}: CoinHeaderProps) => {
  return (
    <Box minHeight="96px" data-testid="coin-header">
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box display="flex" flexDirection="column">
            <ToggleButtonGroup orientation="vertical" sx={{ color: 'white' }}>
              <StyledToggleButton
                value="24hr"
                selected={timeInterval === '24hr'}
                onClick={() => onIntervalClick('24hr')}
              >
                24hr
              </StyledToggleButton>
              <StyledToggleButton
                value="7d"
                selected={timeInterval === '7d'}
                onClick={() => onIntervalClick('7d')}
              >
                7d
              </StyledToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Typography ml={2} display="inline">
            price data for
          </Typography>
          &nbsp;
          <Box bgcolor="white" display="inline" p="8px" borderRadius="4px">
            <Typography
              display="inline"
              fontWeight="bold"
              fontSize="1.2rem"
              color={liveCoinWatchData ? liveCoinWatchData.color : 'black'}
            >
              {selectedCoin?.name || liveCoinWatchData?.name}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CoinHeader;
