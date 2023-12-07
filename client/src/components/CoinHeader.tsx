import { Dispatch, SetStateAction } from 'react';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
} from '@mui/material';
import Trending from './Trending';
import { Coin } from '../types/Coin';
import { LiveCoinWatchData } from '../types/LiveCoinWatchData';
import { TimeInterval } from '../types/TimeInterval';
import { ChartMode } from '../types/ChartMode';

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
    <Box
      minHeight="294px"
      data-testid="coin-header"
      display="flex"
      justifyContent="space-between"
      component="div"
      mx={1}
      sx={{
        flexDirection: {
          xs: 'column-reverse',
          sm: 'column-reverse',
          md: 'row',
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
        component="div"
        my={2}
        flex={1}
      >
        <Box display="flex" component="div">
          <Box display="flex" flexDirection="column" component="div">
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
          <Box ml={2} component="div">
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
        <Box
          bgcolor="white"
          display="inline"
          p="8px"
          borderRadius="4px"
          component="div"
        >
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
      <Box
        flex={0.8}
        sx={{
          border: (theme) => `1px solid ${theme.palette.primary.main}`,
        }}
        borderRadius={1}
        p={1}
        component="div"
      >
        <Trending />
      </Box>
    </Box>
  );
};

export default CoinHeader;
