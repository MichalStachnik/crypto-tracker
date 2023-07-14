import {
  Avatar,
  Box,
  Button,
  Link,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import { LiveCoinWatchData } from '../types/LiveCoinWatchData';
import BTCBlockWrapper from './BTCBlockWrapper';
import BTCTransactionWrapper from './BTCTransactionWrapper';
import { Timeline } from 'react-twitter-widgets';
import ArticleIcon from '@mui/icons-material/Article';
import LaunchIcon from '@mui/icons-material/Launch';
import PublicIcon from '@mui/icons-material/Public';
import { useEffect, useMemo, useState } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { PieLabelRenderProps } from 'recharts';
// import BTCMempoolWrapper from './BTCMempoolWrapper';

interface CoinInfoBoxProps {
  liveCoinWatchData: LiveCoinWatchData;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string;
}

const COLORS = [
  'rgb(255,87,288)',
  'rgb(174,107,241)',
  'rgb(132,117,247)',
  'rgb(81,130,255)',
  'rgb(79,155,244)',
  'rgb(74,220,215)',
  'rgb(99,254,180)',
  'rgb(153,252,142)',
  'rgb(201,250,109)',
  'rgb(253,208,70)',
  'rgb(251,146,67)',
  'rgb(237,61,61)',
  'rgb(189,47,47)',
];

const formatTimeInterval = (timeInterval: string) => {
  let lastIndex = 0;
  timeInterval.split('').forEach((char: string, idx: number) => {
    if (!isNaN(Number(char))) {
      lastIndex = idx;
    }
  });

  const first = timeInterval.substring(0, lastIndex + 1);
  const last = timeInterval.substring(lastIndex + 1);
  return `${first} ${last}`;
};

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
  fill,
}: PieLabelRenderProps) => {
  if (value < 10) return null;
  if (
    typeof innerRadius !== 'number' ||
    typeof outerRadius !== 'number' ||
    typeof cx !== 'number' ||
    typeof cy !== 'number'
  )
    return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * 1.5 * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * 1.5 * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize="0.7rem"
      fill={fill}
    >
      {value}
    </text>
  );
};

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index } = props;
  return <div hidden={value !== index}>{children}</div>;
};

const CoinInfoBox = ({ liveCoinWatchData }: CoinInfoBoxProps) => {
  const theme = useTheme();
  const [miners, setMiners] = useState(null);
  const [activeTab, setActiveTab] = useState<string>('Blocks');
  const [timeInterval, setTimeInterval] = useState('5days');
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    fetchMiners(timeInterval);
  }, []);

  const fetchMiners = (timeInterval: string) => {
    fetch(`/api/miners/${timeInterval}`)
      .then((res) => res.json())
      .then((res) => setMiners(res))
      .catch((err) => console.error('Error', err));
  };

  const formattedMiners = useMemo(() => {
    if (!miners) return null;
    return Object.keys(miners).map((miner) => {
      return { name: miner, value: miners[miner] };
    });
  }, [miners]);

  const handleTimeIntervalClick = (timeInterval: string) => {
    setTimeInterval(timeInterval);
    fetchMiners(timeInterval);
  };

  return (
    <Box
      boxShadow="inset 0 0 15px rgba(0,0,0,0.5)"
      p={2}
      flex={1}
      borderRadius={2}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minWidth={340}
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
            <Button>
              <PublicIcon fontSize="small" />
              <Typography mx={1} textTransform="capitalize">
                website
              </Typography>
              <LaunchIcon fontSize="small" />
            </Button>
          </Link>
          <Link
            href={liveCoinWatchData.links.whitepaper}
            target="_blank"
            rel="noreferrer noopener"
            display="flex"
            alignItems="center"
          >
            <Button>
              <ArticleIcon fontSize="small" />
              <Typography mx={1} textTransform="capitalize">
                whitepaper{' '}
              </Typography>
              <LaunchIcon fontSize="small" />
            </Button>
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
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab
          value="Blocks"
          label="Blocks"
          sx={{ color: theme.palette.primary.main }}
        />
        <Tab
          value="Miners"
          label="Miners"
          sx={{ color: theme.palette.primary.main }}
        />
      </Tabs>
      <TabPanel value={activeTab} index={'Blocks'}>
        <BTCBlockWrapper />
      </TabPanel>
      <TabPanel value={activeTab} index={'Miners'}>
        <Typography mt={2} fontSize="0.7rem">
          Number of blocks mined in the last {formatTimeInterval(timeInterval)}{' '}
          by mining pool
        </Typography>
        <Button
          variant={timeInterval === '24hours' ? 'contained' : 'outlined'}
          onClick={() => handleTimeIntervalClick('24hours')}
        >
          24hr
        </Button>
        <Button
          variant={timeInterval === '5days' ? 'contained' : 'outlined'}
          onClick={() => handleTimeIntervalClick('5days')}
          style={{ margin: 10 }}
        >
          5d
        </Button>
        <Button
          variant={timeInterval === '10days' ? 'contained' : 'outlined'}
          onClick={() => handleTimeIntervalClick('10days')}
        >
          10d
        </Button>
        {formattedMiners ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart width={400} height={400}>
              <Pie
                data={formattedMiners}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                fill="#82ca9d"
                label={renderCustomizedLabel}
                labelLine={false}
                animationDuration={1000}
              >
                {formattedMiners.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : null}
      </TabPanel>
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
