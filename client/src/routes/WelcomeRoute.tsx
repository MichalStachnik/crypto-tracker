import { useContext, useEffect, useState } from 'react';
import { redirect, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { UserContext } from '../contexts/UserContext';

const WelcomeRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(UserContext);
  const [userEmail, setUserEmail] = useState('');

  const verifyJWT = async () => {
    const equalHash = location.hash.indexOf('=');
    const andHash = location.hash.indexOf('&');
    const jwt = location.hash.substring(equalHash + 1, andHash);

    const res = await fetch(`/api/auth/login/verify/${jwt}`);

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
      <Typography mb={2}>Welcome {userEmail}</Typography>
      <Button variant="outlined" onClick={() => navigate('/')}>
        Start Exploring
      </Button>
    </Box>
  );
};

export default WelcomeRoute;
