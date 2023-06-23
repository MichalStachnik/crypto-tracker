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
import { TimeInterval } from '../types/TimeInterval';

const StyledToggleButton = styled(ToggleButton)(() => ({
  color: 'white',
  flex: 1,
  '&.Mui-selected': {
    background: 'white',
  },
}));

interface CoinHeaderProps {
  selectedCoin: Coin | null;
  liveCoinWatchData: LiveCoinWatchData | null;
  timeInterval: TimeInterval;
  onIntervalClick: (newInterval: TimeInterval) => void;
}

const CoinHeader = ({
  selectedCoin,
  liveCoinWatchData,
  timeInterval,
  onIntervalClick,
}: CoinHeaderProps) => {
  return (
    <Box minHeight="96px" data-testid="coin-header">
      <Box display="flex" justifyContent="center" alignItems="center">
        <Box display="flex" flexDirection="column">
          <ToggleButtonGroup
            color="primary"
            exclusive
            sx={{ border: '1px solid white', width: 250 }}
          >
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
            <StyledToggleButton
              value="30d"
              selected={timeInterval === '30d'}
              onClick={() => onIntervalClick('30d')}
            >
              30d
            </StyledToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Typography mx={2} display="inline">
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
    </Box>
  );
};

export default CoinHeader;
