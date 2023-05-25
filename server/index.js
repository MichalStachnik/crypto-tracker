import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
const app = express();

dotenv.config();

const PAPRIKA_BASE_URL = 'https://api.coinpaprika.com/v1/';
const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com';
const COIN_API_BASE_URL = 'https://rest.coinapi.io';
const LIVE_COIN_WATCH_BASE_URL = 'https://api.livecoinwatch.com';
//api.livecoinwatch.com/coins/single/history

https: app.get('/global', async (req, res) => {
  const data = await fetch(`${PAPRIKA_BASE_URL}/global`);
  const json = await data.json();
  res.json(json);
});

app.get('/coins', async (req, res) => {
  const data = await fetch(`${PAPRIKA_BASE_URL}/coins`);
  const json = await data.json();
  res.json(json);
});

app.get('/api/cmc', async (req, res) => {
  const data = await fetch(
    `${CMC_BASE_URL}/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=${process.env.CMC_API_KEY}`
  );
  const json = await data.json();
  res.json(json);
});

app.get('/api/coin/:symbol', async (req, res) => {
  const now = new Date();
  const yesterday = new Date(now.setDate(now.getDate() - 1));
  const data = await fetch(
    `${COIN_API_BASE_URL}/v1/ohlcv/BITSTAMP_SPOT_${
      req.params.symbol
    }_USD/history?period_id=1HRS&time_start=${yesterday.toISOString()}`,
    {
      method: 'GET',
      headers: {
        'X-CoinAPI-Key': process.env.COIN_API_KEY,
      },
    }
  );
  const json = await data.json();
  res.json(json);
});

app.get('/api/livecoinwatch/:symbol', async (req, res) => {
  const now = new Date();
  const yesterday = new Date(now.setDate(now.getDate() - 1));
  const data = await fetch(`${LIVE_COIN_WATCH_BASE_URL}/coins/single/history`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.LIVE_COIN_WATCH_API_KEY,
    },
    body: JSON.stringify({
      currency: 'USD',
      code: req.params.symbol,
      start: yesterday.getTime(),
      end: new Date().getTime(),
      meta: true,
    }),
  });
  const json = await data.json();
  res.json(json);
});

// Serve for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`listening on ${PORT}`));
