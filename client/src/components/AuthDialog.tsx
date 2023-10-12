import { ChangeEvent, MouseEvent, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: ({ email, password }: { email: string; password: string }) => void;
  mode: 'login' | 'signup';
}

export function AuthDialog(props: AuthDialogProps) {
  const { onClose, open, onSubmit, mode } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetPasswordSent, setResetPasswordSent] = useState(false);

  const handleClose = () => {
    onClose();
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit({ email, password });
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleForgotPasswordClick = async () => {
    if (!email) return;
    setResetPasswordSent(true);
    const res = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.error) {
      // Add error toast
      console.warn(data.error);
    } else {
      // Add toast
      console.log(data.message);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle display="flex" flexDirection="column">
        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
          <InputLabel htmlFor="email">Email</InputLabel>
          <OutlinedInput
            id="email"
            label="Email"
            aria-describedby="my-helper-text"
            value={email}
            onChange={handleEmailChange}
          />
        </FormControl>
        {mode === 'signup' ? (
          <FormHelperText sx={{ m: 1 }} id="my-helper-text">
            We'll never share your email.
          </FormHelperText>
        ) : null}
        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          {mode === 'login' ? (
            <Box display="flex">
              {resetPasswordSent ? (
                <FormHelperText>Sent, please check your email</FormHelperText>
              ) : (
                <>
                  <FormHelperText sx={{ m: 1 }}>
                    Forgot your password?
                  </FormHelperText>
                  <Button
                    onClick={handleForgotPasswordClick}
                    sx={{ textTransform: 'initial', fontSize: '0.8rem' }}
                  >
                    Click here
                  </Button>
                </>
              )}
            </Box>
          ) : null}
        </FormControl>
        <Button
          variant="contained"
          onClick={handleSubmit}
          style={{ marginTop: 15 }}
        >
          {mode === 'signup' ? 'Sign Up' : 'Login'}
        </Button>
      </DialogTitle>
    </Dialog>
  );
}

export default AuthDialog;
