import { Avatar, Box, Link, Typography } from '@mui/material';
import { LiveCoinWatchData } from '../types/LiveCoinWatchData';
import BTCBlockWrapper from './BTCBlockWrapper';
import BTCTransactionWrapper from './BTCTransactionWrapper';
import { Timeline } from 'react-twitter-widgets';
import LaunchIcon from '@mui/icons-material/Launch';
// import BTCMempoolWrapper from './BTCMempoolWrapper';

interface CoinInfoBoxProps {
  liveCoinWatchData: LiveCoinWatchData;
}

const CoinInfoBox = ({ liveCoinWatchData }: CoinInfoBoxProps) => {
  return (
    <Box
      boxShadow="inset 0 0 15px rgba(0,0,0,0.5)"
      p={2}
      flex={1}
      borderRadius={2}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minWidth={400}
    >
      <Box display="flex" justifyContent="space-between">
        <Avatar alt={liveCoinWatchData.name} src={liveCoinWatchData.png64} />
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Link
            href={liveCoinWatchData.links.website}
            target="_blank"
            rel="noreferrer noopener"
            display="flex"
            alignItems="center"
          >
            <Typography mr={1}>{liveCoinWatchData.name} website</Typography>
            <LaunchIcon fontSize="small" />
          </Link>
          <Link
            href={liveCoinWatchData.links.whitepaper}
            target="_blank"
            rel="noreferrer noopener"
            display="flex"
            alignItems="center"
          >
            <Typography mr={1}>{liveCoinWatchData.name} whitepaper </Typography>
            <LaunchIcon fontSize="small" />
          </Link>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography># of Markets</Typography>
        <Typography>{liveCoinWatchData.markets}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography># of Pairs</Typography>
        <Typography>{liveCoinWatchData.pairs}</Typography>
      </Box>
      <BTCBlockWrapper />
      <BTCTransactionWrapper />
      {/* TODO: fetch with jwt */}
      {/* <BTCMempoolWrapper /> */}
      {liveCoinWatchData.links.twitter && (
        <Timeline
          dataSource={{
            sourceType: 'profile',
            screenName: `${liveCoinWatchData.links.twitter.split('.com/')[1]}`,
          }}
          options={{
            height: '200',
          }}
        />
      )}
    </Box>
  );
};

export default CoinInfoBox;
