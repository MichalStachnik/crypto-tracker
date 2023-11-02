/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Avatar, Box, Typography } from '@mui/material';

const Trending = () => {
  const [trendingCoins, setTrendingCoins] = useState<[]>([]);
  useEffect(() => {
    fetch('/api/trending')
      .then((res) => res.json())
      .then((res) => console.log('res', setTrendingCoins(res.coins)))
      .catch((err) => console.error('Error', err));
  }, []);

  return (
    <Box>
      <Typography>Top 7 Trending Coins</Typography>
      <Box display="flex" flexDirection="column">
        {trendingCoins.map((coin: any, index) => {
          return (
            <Box
              key={coin.item.id}
              display="flex"
              justifyContent="space-around"
            >
              <Typography>{index + 1}</Typography>
              <Avatar src={coin.item.thumb} sx={{ width: 20, height: 20 }} />
              <Typography>{coin.item.name}</Typography>
              <Typography bgcolor="secondary">
                #{coin.item.market_cap_rank}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Trending;
