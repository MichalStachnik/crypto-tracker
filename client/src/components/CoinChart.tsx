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
import { TimeInterval } from '../types/TimeInterval';
import { ChartMode } from '../types/ChartMode';

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
        <Typography>{`${Number(
          payload[0].value
        ).toLocaleString()} USD`}</Typography>
        <Typography>{`${label}`}</Typography>
      </Box>
    );
  }

  return null;
}

interface CoinChartProps {
  liveCoinWatchData: LiveCoinWatchData;
  timeInterval: TimeInterval;
  chartMode: ChartMode;
}

const key = {
  marketCap: 'cap',
  price: 'rate',
  volume: 'volume',
};

export default function CoinChart({
  liveCoinWatchData,
  timeInterval,
  chartMode,
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
    if (timeInterval === '7d') {
      timeLabel = `${month}/${date} ${timeLabel}`;
    }
    if (timeInterval === '30d') {
      timeLabel = `${month}/${date}`;
    }

    const mode = key[chartMode];
    if (index === 0) {
      min = data[mode].toFixed(2);
      max = data[mode].toFixed(2);
    } else if (data[mode] < min) {
      min = data[mode].toFixed(2);
    } else if (data[mode] > max) {
      max = data[mode].toFixed(2);
    }
    return {
      time: timeLabel,
      price: data[mode] > 1000 ? data[mode].toFixed(0) : data[mode].toFixed(6),
    };
  });

  // Add 1% buffer in upper and lower bounds
  min = Number(min) - Number(min) * 0.01;
  max = Number(max) + Number(max) * 0.01;

  if (min > 10000 && max > 10000) {
    min = Math.ceil(min / 100) * 100;
    max = Math.ceil(max / 100) * 100;
  }

  if (min > 1000) {
    min = Math.floor(min);
    max = Math.floor(max);
  }

  const longestLabelLength = data
    .map((p) => p.price)
    .reduce((acc, cur) => (cur.length > acc ? cur.length : acc), 0);

  return (
    <ResponsiveContainer width="100%" height={750}>
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
            {/* <stop offset="5%" stopColor="#5ccd7c" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#5ccd7c" stopOpacity={0.05} /> */}
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
        <XAxis dataKey="time" style={{ fontSize: '0.8rem' }} />
        <YAxis
          axisLine={false}
          tickLine={false}
          dataKey="price"
          domain={[min, max]}
          width={longestLabelLength * 10}
          style={{ fontSize: '0.7rem' }}
          tickFormatter={(v) => {
            return v > 10000 ? Math.floor(v).toLocaleString() : v.toFixed(4);
          }}
          tickCount={20}
        />
        <Tooltip content={<ChartTooltip />} />
        <Area
          type="monotone"
          dataKey="price"
          stroke="#8884d8"
          // stroke="#5ccd7c"
          fill="url(#color)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
