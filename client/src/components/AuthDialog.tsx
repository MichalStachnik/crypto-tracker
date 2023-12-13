/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, MouseEvent, useState } from 'react';
import { WalletOption } from '@swapkit/sdk';
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
  Typography,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
// import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';

const XDefiWalletLogo = () => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-all box-content animate-none"
      // size="24"
      style={{ width: '24px', height: '24px' }}
    >
      <path
        d="M13.1306 23C27.7227 20.381 25.0855 1 12.0758 1C-0.933958 1 -3.92269 20.5556 15.0645 14.0952"
        stroke="#355DFF"
        strokeWidth="2"
        strokeLinecap="round"
      ></path>
      <path
        d="M1 17.238C4.10593 18.6348 12.4583 18.8749 17.5259 15.3174"
        stroke="#355DFF"
        strokeWidth="2"
        strokeLinecap="round"
      ></path>
      <path
        d="M5.58301 21.1668C9.27496 21.1668 15.208 20.7084 19.6353 16.7144"
        stroke="#355DFF"
        strokeWidth="2"
        strokeLinecap="round"
      ></path>
      <circle cx="18.875" cy="10.625" r="1.375" fill="#355DFF"></circle>
    </svg>
  );
};

export interface AuthDialogProps {
  open: boolean;
  onClose: (isConnected: boolean | null) => void;
  onSubmit: ({ email, password }: { email: string; password: string }) => void;
  mode: 'login' | 'signup';
}

export function AuthDialog(props: AuthDialogProps) {
  const { onClose, open, onSubmit, mode } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetPasswordSent, setResetPasswordSent] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletOption | null>(
    null
  );
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  // const [isTwitterLoading, setIsTwitterLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);

  const handleConnect = async () => {
    setIsWalletConnecting(true);
    if (!selectedWallet) return;
    // const isConnected = await connectWallet(selectedWallet);
    const swapkitImport = await import('../utils/swapKit');
    await swapkitImport.connectXDEFI();
    setIsWalletConnecting(false);
    onClose(true);
  };

  const handleClose = () => {
    onClose(null);
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

  const handleGoogleClick = async () => {
    setIsGoogleLoading(true);
    try {
      const data = await fetch('/api/login/google');
      const json = await data.json();
      window.location.replace(json.url);
    } catch (error) {
      console.error('error', error);
      setIsGoogleLoading(false);
    }
  };

  // const handleTwitterClick = async () => {
  //   setIsTwitterLoading(true);
  //   try {
  //     const data = await fetch('/api/login/twitter');
  //     const json = await data.json();
  //     window.location.replace(json.url);
  //   } catch (error) {
  //     console.error('error', error);
  //     setIsTwitterLoading(false);
  //   }
  // };

  const handleGitHubClick = async () => {
    setIsGitHubLoading(true);
    try {
      const data = await fetch('/api/login/github');
      const json = await data.json();
      window.location.replace(json.url);
    } catch (error) {
      console.error('error', error);
      setIsGitHubLoading(false);
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
            <Box display="flex" component="div">
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
        <Typography align="center" mt={2}>
          Or continue with:
        </Typography>
        <Box
          component="div"
          display="flex"
          justifyContent="space-around"
          mt={2}
        >
          <LoadingButton
            loading={isGoogleLoading}
            variant="outlined"
            onClick={handleGoogleClick}
          >
            <GoogleIcon />
          </LoadingButton>
          {/* <LoadingButton
            loading={isTwitterLoading}
            variant="outlined"
            onClick={handleTwitterClick}
          >
            <TwitterIcon />
          </LoadingButton> */}
          <LoadingButton
            loading={isGitHubLoading}
            variant="outlined"
            onClick={handleGitHubClick}
          >
            <GitHubIcon />
          </LoadingButton>
        </Box>
        <Button
          onClick={() => setSelectedWallet(WalletOption.XDEFI)}
          component="label"
          variant="contained"
          startIcon={<XDefiWalletLogo />}
          style={{ marginTop: 15 }}
          disabled={!!selectedWallet && selectedWallet === WalletOption.XDEFI}
        >
          XDefi Wallet
        </Button>
        <LoadingButton
          loading={isWalletConnecting}
          variant="contained"
          onClick={handleConnect}
          style={{ marginTop: 15 }}
          disabled={!selectedWallet}
        >
          Connect Wallet
        </LoadingButton>
      </DialogTitle>
    </Dialog>
  );
}

export default AuthDialog;
