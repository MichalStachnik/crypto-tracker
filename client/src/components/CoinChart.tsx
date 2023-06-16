import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import { LiveCoinWatchData } from '../types/LiveCoinWatchData';
import { Box, Typography } from '@mui/material';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import { TimeInterval } from '../App';

function ChartTooltip({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) {
  if (active && payload && payload.length) {
    return (
      <Box
        bgcolor="primary"
        display="flex"
        flexDirection="column"
        width="200px"
      >
        <Typography>{`${payload[0].value} USD`}</Typography>
        <Typography>{`${label}`}</Typography>
      </Box>
    );
  }

  return null;
}

interface CoinChartProps {
  liveCoinWatchData: LiveCoinWatchData;
  timeInterval: TimeInterval;
}

export default function CoinChart({
  liveCoinWatchData,
  timeInterval,
}: CoinChartProps) {
  let min = 0;
  let max = 0;
  const data = liveCoinWatchData.history.map((data, index) => {
    const time = new Date(data.date);
    const month = time.getMonth();
    const date = time.getDate();
    const hours = time.getHours();
    const minutes = time.getMinutes();

    let timeLabel = `${hours}:${minutes}`;
    if (minutes < 10 || minutes === 0) {
      timeLabel = `${hours}:0${minutes}`;
    }
    if (timeInterval === '7d' || timeInterval === '30d') {
      timeLabel = `${month}/${date} ${timeLabel}`;
    }

    if (index === 0) {
      min = data.rate.toFixed(2);
      max = data.rate.toFixed(2);
    } else if (data.rate < min) {
      min = data.rate.toFixed(2);
    } else if (data.rate > max) {
      max = data.rate.toFixed(2);
    }
    return {
      time: timeLabel,
      price: data.rate.toFixed(0),
    };
  });
  return (
    <ResponsiveContainer width="100%" height={600}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
        <XAxis dataKey="time" />
        <YAxis
          axisLine={false}
          tickLine={false}
          dataKey="price"
          domain={[min - 100, max + 100]}
          width={70}
          style={{ fontSize: '0.8rem' }}
        />
        <Tooltip content={<ChartTooltip />} />
        <Area
          type="monotone"
          dataKey="price"
          stroke="#8884d8"
          fill="url(#color)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
