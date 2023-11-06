/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import { Avatar, Box, Button, Typography } from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { CoinContext } from '../contexts/CoinContext';

const Trending = () => {
  const { coins, selectedCoin, setSelectedCoin, fetchLiveCoinWatch } =
    useContext(CoinContext);
  const [trendingCoins, setTrendingCoins] = useState<[]>([]);
  useEffect(() => {
    fetch('/api/trending')
      .then((res) => res.json())
      .then((res) => setTrendingCoins(res.coins))
      .catch((err) => console.error('Error', err));
  }, []);

  const handleCoinClick = (_coin: any) => {
    const coin = coins.find((coin) => coin.symbol === _coin.item.symbol);
    if (coin) {
      setSelectedCoin(coin);
      fetchLiveCoinWatch(coin.symbol, '24hr');
    }
  };

  return (
    <Box component="div">
      <Box display="flex" justifyContent="center" component="div" mb={1}>
        <WhatshotIcon />
        <Typography ml={1}>Top 7 Trending Coins</Typography>
      </Box>
      <Box display="flex" flexDirection="column" component="div">
        {trendingCoins.length
          ? trendingCoins.map((coin: any, index) => {
              return (
                <Button
                  key={coin.item.id}
                  onClick={() => handleCoinClick(coin)}
                  sx={{ textTransform: 'none' }}
                  disabled={coin.item.symbol === selectedCoin?.symbol}
                >
                  <Box
                    width="100%"
                    display="flex"
                    justifyContent="space-around"
                    component="div"
                  >
                    <Typography>{index + 1}</Typography>
                    <Avatar
                      src={coin.item.thumb}
                      sx={{ width: 20, height: 20 }}
                    />
                    <Typography>{coin.item.name}</Typography>
                    <Typography bgcolor="secondary">
                      #{coin.item.market_cap_rank}
                    </Typography>
                  </Box>
                </Button>
              );
            })
          : null}
      </Box>
    </Box>
  );
};

export default Trending;
