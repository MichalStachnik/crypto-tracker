import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CoinMarketData } from '../types/CoinMarketData';

interface CoinChartProps {
  selectedCoinData: CoinMarketData[];
}

export default function CoinChart({ selectedCoinData }: CoinChartProps) {
  const data = selectedCoinData.map((data) => {
    return {
      time: new Date(Date.parse(data.time_close)).getHours(),
      price: data.price_close,
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
