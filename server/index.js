import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import redis from 'redis';
const app = express();

dotenv.config();

const PAPRIKA_BASE_URL = 'https://api.coinpaprika.com/v1/';
const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com';
const COIN_API_BASE_URL = 'https://rest.coinapi.io';
const LIVE_COIN_WATCH_BASE_URL = 'https://api.livecoinwatch.com';

app.use(express.json());

let redisClient;

(async () => {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on('error', (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

app.get('/api/global', async (req, res) => {
  const cacheValue = await redisClient.get('globalData');
  if (cacheValue) {
    res.json(JSON.parse(cacheValue));
    return;
  }

  const data = await fetch(`${PAPRIKA_BASE_URL}/global`);
  const json = await data.json();
  redisClient.setEx('globalData', 60 * 5, JSON.stringify(json));
  res.json(json);
});

app.get('/coins', async (req, res) => {
  const data = await fetch(`${PAPRIKA_BASE_URL}/coins`);
  const json = await data.json();
  res.json(json);
});

app.get('/api/mempool', async (req, res) => {
  try {
    const data = await fetch(process.env.QUICK_NODE_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '1.0',
        id: 'curltest',
        method: 'getrawmempool',
        params: [true],
      }),
    });
    const json = await data.json();
    res.json(json);
  } catch (error) {
    console.log('error fetching from quick node', error);
    console.error('error fetching from quick node', error);
  }
});

app.get('/api/cmc', async (req, res) => {
  const cacheValue = await redisClient.get('cmcData');
  if (cacheValue) {
    res.json(JSON.parse(cacheValue));
    return;
  }
  const data = await fetch(
    `${CMC_BASE_URL}/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=${process.env.CMC_API_KEY}`
  );
  const json = await data.json();
  redisClient.setEx('cmcData', 60 * 5, JSON.stringify(json));
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

app.get('/api/livecoinwatch/:symbol/:interval', async (req, res) => {
  const { symbol, interval } = req.params;
  const cacheValue = await redisClient.get(`${symbol}:${interval}`);
  if (cacheValue) {
    res.json(JSON.parse(cacheValue));
    return;
  }

  const now = new Date();
  let start;
  if (interval === '24hr') {
    start = new Date(now.setDate(now.getDate() - 1));
  } else if (interval === '7d') {
    start = new Date(now.setDate(now.getDate() - 7));
  }
  const data = await fetch(`${LIVE_COIN_WATCH_BASE_URL}/coins/single/history`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.LIVE_COIN_WATCH_API_KEY,
    },
    body: JSON.stringify({
      currency: 'USD',
      code: symbol,
      start: start.getTime(),
      end: new Date().getTime(),
      meta: true,
    }),
  });
  const json = await data.json();
  redisClient.setEx(`${symbol}:${interval}`, 60 * 5, JSON.stringify(json));
  res.json(json);
});

app.get('/api/btc/latest-block', async (req, res) => {
  const cacheValue = await redisClient.get('latestBlock');
  if (cacheValue) {
    res.json(JSON.parse(cacheValue));
    return;
  }
  const data = await fetch(`https://blockchain.info/latestblock`);
  const json = await data.json();
  const { hash } = json;
  const rawBlockData = await fetch(`https://blockchain.info/rawblock/${hash}`);
  const blockData = await rawBlockData.json();
  redisClient.setEx('latestBlock', 60 * 5, JSON.stringify(json));
  res.json(blockData);
});

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL,
  process.env.SUPABASE_API_KEY
);

app.post('/api/signup', async (req, res) => {
  const { data, error } = await supabase.auth.signUp({
    email: req.body.email,
    password: req.body.password,
  });
  res.json({ data, error });
});

app.post('/api/login', async (req, res) => {
  const signInQuery = await supabase.auth.signInWithPassword({
    email: req.body.email,
    password: req.body.password,
  });
  if (signInQuery.error) {
    res.json({ message: 'error', error: signInQuery.error });
  }
  res.setHeader(
    'Set-Cookie',
    `cookie=${signInQuery.data.session.access_token}; HttpOnly`
  );
  let data = { user: signInQuery.data };
  // Get favorites
  const coinQuery = await supabase
    .from('coin')
    .select('name')
    .eq('email', req.body.email);

  if (!coinQuery.error) {
    data['favorites'] = coinQuery.data;
  }
  res.json({ message: 'success', data });
});

app.get('/api/logout', async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('error');
    res.json({ message: 'error', error });
  } else {
    res.status(202).json({ message: 'success' });
  }
});

app.post('/api/get-favorites', async (req, res) => {
  const jwt = req.body.user;

  const user = await supabase.auth.getUser(jwt);
  const userError = user.error;
  if (userError) {
    console.error('user error', userError);
    res.status(500).json({ message: 'error', error: userError });
    return;
  }
  const email = user.data.user.email;

  const { data, error } = await supabase
    .from('coin')
    .select('name')
    .eq('email', email);
  if (error) {
    res.status(500).json({ error });
  } else {
    res.status(200).json({ message: 'success', data });
  }
});

app.post('/api/add-favorite', async (req, res) => {
  const { jwt, favorite } = req.body;

  const user = await supabase.auth.getUser(jwt);
  const email = user.data.user.email;

  // Check if favorite already exists on user
  const userData = await supabase
    .from('coin')
    .select('name')
    .eq('name', favorite)
    .eq('email', email);

  if (userData.data.length) {
    const hasFavorite = userData.data.find((coin) => coin.name === favorite);
    if (hasFavorite) return;
  }

  const { error } = await supabase
    .from('coin')
    .insert({ email, name: favorite });
  if (error) {
    res.status(500).json({ error });
  } else {
    res.status(200).json({ message: 'success' });
  }
});

app.post('/api/delete-favorite', async (req, res) => {
  const { jwt, favorite } = req.body;
  const user = await supabase.auth.getUser(jwt);
  const email = user.data.user.email;

  const { error } = await supabase
    .from('coin')
    .delete()
    .eq('email', email)
    .eq('name', favorite);
  if (error) {
    res.status(500).json({ error });
  } else {
    res.status(200).json({ message: 'success' });
  }
});

// Serve for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist'));
  app.get('*', (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`listening on ${PORT}`));
