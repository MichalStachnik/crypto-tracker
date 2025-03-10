import express from 'express';
import * as jose from 'jose';
import { supabase } from '../utils/supabase.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { data, error } = await supabase.auth.signUp({
    email: req.body.email,
    password: req.body.password,
  });
  res.json({ data, error });
});

router.post('/login', async (req, res) => {
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

router.get('/login/google', async (req, res) => {
  const redirectTo =
    process.env.NODE_ENV === 'production'
      ? 'https://wenmewn.app/welcome/'
      : 'http://localhost:5173/welcome/';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      redirectTo,
    },
  });

  if (error) {
    res.json({ message: 'error', error });
    return;
  }

  res.json(data);
});

router.get('/login/twitter', async (req, res) => {
  const redirectTo =
    process.env.NODE_ENV === 'production'
      ? 'https://wenmewn.app/welcome/'
      : 'https://localhost:5173/welcome/';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'twitter',
    options: {
      redirectTo,
    },
  });

  if (error) {
    res.json({ message: 'error', error });
    return;
  }

  res.json(data);
});

router.get('/login/github', async (req, res) => {
  const redirectTo =
    process.env.NODE_ENV === 'production'
      ? 'https://wenmewn.app/welcome/'
      : 'http://localhost:5173/welcome/';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo,
    },
  });

  if (error) {
    res.json({ message: 'error', error });
    return;
  }

  res.json(data);
});

router.get('/login/verify/:token', async (req, res) => {
  const { token } = req.params;

  const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);
  const { payload } = await jose.jwtVerify(token, secret);

  if (payload.role === 'authenticated') {
    const data = {
      token,
      email: payload.email,
    };
    res.json({ message: 'success', data });
  } else {
    res.json({ message: 'error' });
  }
});

router.get('/logout', async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('error');
    res.json({ message: 'error', error });
  } else {
    res.status(202).json({ message: 'success' });
  }
});

router.post('/forgot-password', async (req, res) => {
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

router.post('/update-password', async (req, res) => {
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

export default router;
