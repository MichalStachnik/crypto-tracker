import { ChangeEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const PasswordReset = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { hash } = location;
  const refreshToken = hash.substring(
    hash.indexOf('refresh_token=') + 'refresh_token='.length,
    hash.indexOf('&token_type')
  );

  const [password0, setPassword0] = useState('');
  const [password1, setPassword1] = useState('');
  const [showPassword0, setShowPassword0] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const handlePassword0Change = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword0(e.target.value);
  };

  const handlePassword1Change = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword1(e.target.value);
  };

  const handleSubmit = async () => {
    if (password0 !== password1) return;
    const res = await fetch('/api/auth/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: password0,
        refreshToken,
      }),
    });

    const data = await res.json();
    if (data.redirectTo) {
      return navigate('/');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="50%"
      margin="0 auto"
      component="div"
    >
      <Box
        bgcolor={theme.palette.background.paper}
        display="flex"
        flexDirection="column"
        p={2}
        mt={10}
        component="div"
      >
        <FormControl sx={{ m: 1 }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            New Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword0 ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword0(!showPassword0)}
                  edge="end"
                >
                  {showPassword0 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            value={password0}
            onChange={handlePassword0Change}
          />
        </FormControl>
        <FormControl sx={{ m: 1 }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Confirm New Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword1 ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword1(!showPassword1)}
                  edge="end"
                >
                  {showPassword1 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            value={password1}
            onChange={handlePassword1Change}
          />
        </FormControl>
        <Button
          variant="contained"
          onClick={handleSubmit}
          style={{ marginTop: 15 }}
        >
          Change
        </Button>
      </Box>
    </Box>
  );
};

export default PasswordReset;
