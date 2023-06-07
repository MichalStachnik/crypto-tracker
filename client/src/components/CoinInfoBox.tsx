import { Box, Link } from '@mui/material';
import { LiveCoinWatchData } from '../types/LiveCoinWatchData';
import BTCBlockWrapper from './BTCBlockWrapper';
import BTCTransactionWrapper from './BTCTransactionWrapper';
import { Timeline } from 'react-twitter-widgets';

interface CoinInfoBoxProps {
  liveCoinWatchData: LiveCoinWatchData;
}

const CoinInfoBox = ({ liveCoinWatchData }: CoinInfoBoxProps) => {
  return (
    <Box
      boxShadow="inset 0 0 10px rgba(0,0,0,0.5)"
      p={2}
      flex={1}
      borderRadius={2}
      display="flex"
      flexDirection="column"
    >
      <Box display="flex" flexDirection="column" alignItems="center">
        <Link
          href={liveCoinWatchData.links.website}
          target="_blank"
          rel="noreferrer noopener"
        >
          {liveCoinWatchData.name} website
        </Link>
        <Link
          href={liveCoinWatchData.links.whitepaper}
          target="_blank"
          rel="noreferrer noopener"
        >
          {liveCoinWatchData.name} whitepaper
        </Link>
      </Box>
      <BTCBlockWrapper />
      <BTCTransactionWrapper />
      {liveCoinWatchData.links.twitter && (
        <Timeline
          dataSource={{
            sourceType: 'profile',
            screenName: `${liveCoinWatchData.links.twitter.split('.com/')[1]}`,
          }}
          options={{
            height: '400',
          }}
        />
      )}
    </Box>
  );
};

export default CoinInfoBox;
