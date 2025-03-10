import { ChangeEvent, MouseEvent, useContext, useState } from 'react';
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
import { WalletContext } from '../contexts/WalletContext';
import { XDefiWalletLogo } from './svg/XDefiWalletLogo';
import { MetamaskWalletLogo } from './svg/MetamaskWalletLogo';

export interface AuthDialogProps {
  open: boolean;
  onClose: (isConnected: boolean | null) => void;
  onSubmit: ({ email, password }: { email: string; password: string }) => void;
  mode: 'login' | 'signup';
}

export function AuthDialog(props: AuthDialogProps) {
  const { onClose, open, onSubmit, mode } = props;
  const { setConnectedChains } = useContext(WalletContext);
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
    const swapkitImport = await import('../utils/swapKit');
    switch (selectedWallet) {
      case WalletOption.METAMASK: {
        await swapkitImport.connectEVMWallet(WalletOption.METAMASK);
        break;
      }
      case WalletOption.XDEFI: {
        await swapkitImport.connectXDEFI();
        break;
      }
    }
    const connectedChains = swapkitImport.getConnectedChains();
    setConnectedChains(connectedChains);
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
    const res = await fetch('/api/auth/forgot-password', {
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
      const data = await fetch('/api/auth/login/google');
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
      const data = await fetch('/api/auth/login/github');
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
          Or continue with
        </Typography>
        <Box
          component="div"
          display="flex"
          justifyContent="space-between"
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
        <Typography align="center" mt={2}>
          Or connect your wallet
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Button
            onClick={() => setSelectedWallet(WalletOption.XDEFI)}
            component="label"
            variant="outlined"
            startIcon={<XDefiWalletLogo />}
            style={{ marginTop: 15 }}
            disabled={!!selectedWallet && selectedWallet === WalletOption.XDEFI}
          >
            XDefi
          </Button>
          <Button
            onClick={() => setSelectedWallet(WalletOption.METAMASK)}
            component="label"
            variant="outlined"
            startIcon={<MetamaskWalletLogo />}
            style={{ marginTop: 15 }}
            disabled={
              !!selectedWallet && selectedWallet === WalletOption.METAMASK
            }
          >
            Metamask
          </Button>
        </Box>
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
