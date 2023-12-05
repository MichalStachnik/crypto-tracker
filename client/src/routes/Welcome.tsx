import { useContext, useEffect, useState } from 'react';
import { redirect, useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { UserContext } from '../contexts/UserContext';

const WelcomeRoute = () => {
  const location = useLocation();
  const { setUser } = useContext(UserContext);
  const [userEmail, setUserEmail] = useState('');

  const verifyJWT = async () => {
    const equalHash = location.hash.indexOf('=');
    const andHash = location.hash.indexOf('&');
    const jwt = location.hash.substring(equalHash + 1, andHash);

    const res = await fetch(`/api/verify/google/${jwt}`);

    const { data, message } = await res.json();

    if (message === 'success') {
      localStorage.setItem('user', data.token);
      setUser(data.token);
      setUserEmail(data.email);
    } else {
      redirect('/');
    }
  };

  useEffect(() => {
    verifyJWT();
  }, []);

  return (
    <Box component="div">
      <Typography>Welcome {userEmail}</Typography>
    </Box>
  );
};

export default WelcomeRoute;
