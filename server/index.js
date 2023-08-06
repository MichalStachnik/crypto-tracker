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

  redisClient.on('error', async (error) => {
    console.error(`Redis Error : ${error}`);
    await redisClient.disconnect();
  });

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
    `${CMC_BASE_URL}/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=${process.env.CMC_API_KEY}&limit=500`
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
  } else if (interval === '30d') {
    start = new Date(now.setDate(now.getDate() - 30));
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
  redisClient.setEx('latestBlock', 60 * 5, JSON.stringify(blockData));
  res.json(blockData);
});

app.post('/api/btc/get-block', async (req, res) => {
  const { hash } = req.body;
  const cacheValue = await redisClient.get(hash);
  if (cacheValue) {
    res.json(JSON.parse(cacheValue));
    return;
  }
  const rawBlockData = await fetch(`https://blockchain.info/rawblock/${hash}`);
  const blockData = await rawBlockData.json();
  redisClient.setEx(hash, 60 * 5, JSON.stringify(blockData));
  res.json(blockData);
});

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL,
  process.env.SUPABASE_API_KEY,
  {
    auth: {
      persistSession: false,
    },
  }
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
    return;
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

  const notificationQuery = await supabase
    .from('notifications')
    .select('*')
    .eq('email', req.body.email);

  if (!notificationQuery.error) {
    data['notifications'] = notificationQuery.data;
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

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  const redirectTo =
    process.env.NODE_ENV === 'production'
      ? 'https://wenmewn.app/password-reset'
      : 'http://localhost:5173/password-reset';
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    res.status(500).json({ message: 'error' });
  } else {
    res.status(201).json({ message: 'email sent' });
  }
});

app.post('/api/update-password', async (req, res) => {
  const { password, refreshToken } = req.body;

  const refreshSession = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (refreshSession.error) {
    res.status(500).json({ message: 'error' });
    return;
  }

  const updateUser = await supabase.auth.updateUser({ password });

  if (updateUser.error) {
    res.status(500).json({ message: 'error' });
    return;
  }

  const redirectTo =
    process.env.NODE_ENV === 'production'
      ? 'https://wenmewn.app/'
      : 'http://localhost:5173/';

  res.json({ message: 'password updated', redirectTo });
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

app.post('/api/add-notification', async (req, res) => {
  const { jwt, coin, price } = req.body;
  const user = await supabase.auth.getUser(jwt);
  const email = user.data.user.email;

  // Check if notification already exists for user
  const userData = await supabase
    .from('notifications')
    .select('coin')
    .eq('coin', coin)
    .eq('email', email);

  if (userData.data.length) {
    const hasNotification = userData.data.find(
      (notification) =>
        notification.coin === coin && notification.price === price
    );
    if (hasNotification) {
      res.status(500)({ message: 'notification already exists' });
    }
  }

  // TODO: timestamp the coin price to determine if its lower or higher
  // get current price to determine lower or higher

  const { error } = await supabase
    .from('notifications')
    .insert({ email, coin, price });
  if (error) {
    res.status(500).json({ error });
  } else {
    res.status(200).json({ message: 'success' });
  }
});

app.post('/api/get-notifications', async (req, res) => {
  const { jwt } = req.body;
  const user = await supabase.auth.getUser(jwt);
  const email = user.data.user.email;

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('email', email);

  if (error) {
    res.status(500).json({ error });
  } else {
    res.status(200).json({ data, message: 'success' });
  }
});

app.get('/api/miners/:interval', async (req, res) => {
  const timespan = req.params.interval;
  const data = await fetch(
    `https://api.blockchain.info/pools?timespan=${timespan}`
  );
  const json = await data.json();
  res.json(json);
});

app.get('/api/hashrate/:interval', async (req, res) => {
  const timespan = req.params.interval;
  const data = await fetch(
    `https://api.blockchain.info/charts/hash-rate?timespan=${timespan}`
  );
  const json = await data.json();
  res.json(json);
});

app.get('/api/news/:query', async (req, res) => {
  const { query } = req.params;
  const data = await fetch(
    `https://newsapi.org/v2/everything?q=${query}&apiKey=${process.env.NEWS_API}`
  );
  const json = await data.json();
  res.json(json);
});

// Check notifications
(() => {
  setInterval(async () => {
    // Get all notifications
    const { data: notificationData, error } = await supabase
      .from('notifications')
      .select('*');
    if (error) {
      console.error('error', error);
      return;
    }

    // Check and get cmcData cache value
    const cacheValue = await redisClient.get('cmcData');
    let cmcData = JSON.parse(cacheValue);
    if (!cmcData) {
      const data = await fetch(
        `${CMC_BASE_URL}/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=${process.env.CMC_API_KEY}`
      );
      cmcData = await data.json();
      redisClient.setEx('cmcData', 60 * 5, JSON.stringify(cmcData));
    }

    // For each notification data check if the corresponding cmcData price is greater
    notificationData.map(async (notificationItem) => {
      const cmcItem = cmcData.data.find(
        (item) => item.name === notificationItem.coin
      );

      if (cmcItem.quote.USD.price >= notificationItem.price) {
        const response = await fetch(process.env.SUPABASE_EMAIL_EDGE_FUNCTION, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            email: notificationItem.email,
            message: `hey! ${notificationItem.coin} has reached ${notificationItem.price} - check it out on wenmewn.app`,
          }),
        });

        // Remove notification from table
        await supabase
          .from('notifications')
          .delete()
          .eq('id', notificationItem.id);
      }
    });
  }, 1000 * 60 * 5);
})();

// Serve for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist'));
  app.get('*', (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    console.log('import.meta.url --->', import.meta.url);
    console.log('the filename -->', __filename);
    console.log('the dirname -->', __dirname);
    res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`listening on ${PORT}`));
