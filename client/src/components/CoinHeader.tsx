import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
} from '@mui/material';
import { Coin } from '../types/Coin';
import { LiveCoinWatchData } from '../types/LiveCoinWatchData';
import { TimeInterval } from '../types/TimeInterval';
import { ChartMode } from '../types/ChartMode';
import { Dispatch, SetStateAction } from 'react';

const StyledToggleButton = styled(ToggleButton)(() => ({
  color: 'white',
  flex: 1,
  textTransform: 'capitalize',
  '&.Mui-selected': {
    background: 'white',
  },
}));

interface CoinHeaderProps {
  selectedCoin: Coin | null;
  liveCoinWatchData: LiveCoinWatchData | null;
  timeInterval: TimeInterval;
  onIntervalClick: (newInterval: TimeInterval) => void;
  chartMode: ChartMode;
  setChartMode: Dispatch<SetStateAction<ChartMode>>;
}

const CoinHeader = ({
  selectedCoin,
  liveCoinWatchData,
  timeInterval,
  onIntervalClick,
  chartMode,
  setChartMode,
}: CoinHeaderProps) => {
  return (
    <Box minHeight="96px" data-testid="coin-header">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <Box display="flex">
          <Box display="flex" flexDirection="column">
            <ToggleButtonGroup
              color="primary"
              exclusive
              sx={{ width: 150 }}
              orientation="vertical"
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
          <Box ml={2}>
            <ToggleButtonGroup
              color="primary"
              orientation="vertical"
              exclusive
              sx={{ width: 150 }}
            >
              <StyledToggleButton
                value="price"
                selected={chartMode === 'price'}
                onClick={() => setChartMode('price')}
              >
                price
              </StyledToggleButton>
              <StyledToggleButton
                value="marketCap"
                selected={chartMode === 'marketCap'}
                onClick={() => setChartMode('marketCap')}
              >
                market cap
              </StyledToggleButton>
              <StyledToggleButton
                value="volume"
                selected={chartMode === 'volume'}
                onClick={() => setChartMode('volume')}
              >
                volume
              </StyledToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
        <Typography mx={2} display="inline">
          data for
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
