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
import { Box, Typography } from '@mui/material';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

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
        <Typography>{`${payload[0].value} Transactions`}</Typography>
        <Typography>{label}</Typography>
      </Box>
    );
  }

  return null;
}

interface TransactionChartProps {
  sizes: number[];
}

const TransactionChart = ({ sizes }: TransactionChartProps) => {
  let sum = 0;
  const sumData = sizes.map((size, index) => {
    sum += size;
    return {
      time: index,
      size: sum / (index + 1),
    };
  });
  const data = sizes.map((size, index) => {
    return {
      time: index,
      size,
    };
  });
  return (
    <>
      <ResponsiveContainer width="100%" height={100}>
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
            dataKey="size"
            width={70}
            style={{ fontSize: '0.8rem' }}
          />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="size"
            stroke="#8884d8"
            fill="url(#color)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={100}>
        <AreaChart
          data={sumData}
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
            dataKey="size"
            width={70}
            style={{ fontSize: '0.8rem' }}
          />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="size"
            stroke="#8884d8"
            fill="url(#color)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
};

export default TransactionChart;
