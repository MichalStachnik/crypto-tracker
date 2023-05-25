import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { LiveCoinWatchData } from '../types/LiveCoinWatchData';

interface CoinChartProps {
  liveCoinWatchData: LiveCoinWatchData;
}

export default function CoinChart({ liveCoinWatchData }: CoinChartProps) {
  const data = liveCoinWatchData.history.map((data) => {
    const time = new Date(data.date);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    return {
      time: `${hours}:${minutes}`,
      price: data.rate.toFixed(4),
    };
  });
  return (
    <AreaChart
      width={800}
      height={600}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis dataKey="price" />
      <Tooltip />
      <Area type="monotone" dataKey="price" stroke="#8884d8" fill="#8884d8" />
    </AreaChart>
  );
}
