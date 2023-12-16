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

const MetamaskWalletLogo = () => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-all box-content animate-none"
      // size="24"
      style={{ width: '24px', height: '24px' }}
    >
      <path
        d="M23.4447 0L13.1465 7.45289L15.0615 3.06065L23.4447 0Z"
        fill="#E17726"
      ></path>
      <path
        d="M0.580078 0.00927734L8.94091 3.06168L10.7593 7.5114L0.580078 0.00927734Z"
        fill="#E27625"
      ></path>
      <path
        d="M19.3002 15.8501L23.8517 15.9348L22.2611 21.2202L16.707 19.7246L19.3002 15.8501Z"
        fill="#E27625"
      ></path>
      <path
        d="M4.70059 15.8501L7.28397 19.7246L1.7393 21.2203L0.158203 15.9348L4.70059 15.8501Z"
        fill="#E27625"
      ></path>
      <path
        d="M10.5127 6.37793L10.6988 12.254L5.13281 12.0063L6.71597 9.67011L6.73604 9.64764L10.5127 6.37793Z"
        fill="#E27625"
      ></path>
      <path
        d="M13.43 6.31104L17.2644 9.64649L17.2843 9.66887L18.8676 12.005L13.3027 12.2526L13.43 6.31104Z"
        fill="#E27625"
      ></path>
      <path
        d="M7.44633 15.8667L10.4855 18.1828L6.95508 19.8499L7.44633 15.8667Z"
        fill="#E27625"
      ></path>
      <path
        d="M16.5531 15.8667L17.0343 19.8503L13.5137 18.183L16.5531 15.8667Z"
        fill="#E27625"
      ></path>
      <path
        d="M13.5918 17.9648L17.1643 19.6568L13.8412 21.2015L13.8757 20.1805L13.5918 17.9648Z"
        fill="#D5BFB2"
      ></path>
      <path
        d="M10.4074 17.9668L10.1347 20.1651L10.1571 21.2015L6.82617 19.658L10.4074 17.9668Z"
        fill="#D5BFB2"
      ></path>
      <path
        d="M9.37571 13.0195L10.3093 14.9385L7.13086 14.0278L9.37571 13.0195Z"
        fill="#233447"
      ></path>
      <path
        d="M14.6248 13.0195L16.8802 14.0277L13.6914 14.9381L14.6248 13.0195Z"
        fill="#233447"
      ></path>
      <path
        d="M7.68935 15.8481L7.1756 19.978L4.42188 15.9385L7.68935 15.8481Z"
        fill="#CC6228"
      ></path>
      <path
        d="M16.3105 15.8481L19.5781 15.9385L16.8141 19.9782L16.3105 15.8481Z"
        fill="#CC6228"
      ></path>
      <path
        d="M18.9479 11.7734L16.5699 14.1438L14.7364 13.3243L13.8586 15.1293L13.2832 12.0255L18.9479 11.7734Z"
        fill="#CC6228"
      ></path>
      <path
        d="M5.05078 11.7734L10.7166 12.0256L10.141 15.1293L9.26307 13.3246L7.43935 14.1439L5.05078 11.7734Z"
        fill="#CC6228"
      ></path>
      <path
        d="M4.89062 11.2861L7.58107 13.9564L7.67426 16.5926L4.89062 11.2861Z"
        fill="#E27525"
      ></path>
      <path
        d="M19.1129 11.2803L16.3242 16.596L16.4292 13.9553L19.1129 11.2803Z"
        fill="#E27525"
      ></path>
      <path
        d="M10.5844 11.4487L10.6926 12.1153L10.9602 13.7759L10.7882 18.8765L9.97489 14.7791L9.97461 14.7368L10.5844 11.4487Z"
        fill="#E27525"
      ></path>
      <path
        d="M13.4126 11.4395L14.0239 14.7368L14.0236 14.7791L13.2083 18.8867L13.176 17.8593L13.0488 13.7457L13.4126 11.4395Z"
        fill="#E27525"
      ></path>
      <path
        d="M16.667 13.8491L16.5761 16.1395L13.7378 18.3022L13.1641 17.9058L13.8072 14.6657L16.667 13.8491Z"
        fill="#F5841F"
      ></path>
      <path
        d="M7.3418 13.8491L10.1918 14.6657L10.8349 17.9058L10.2612 18.3022L7.4228 16.1392L7.3418 13.8491Z"
        fill="#F5841F"
      ></path>
      <path
        d="M6.2832 19.1514L9.91434 20.8341L9.89896 20.1155L10.2027 19.8547H13.7966L14.1114 20.1146L14.0882 20.8327L17.6964 19.1556L15.9406 20.5746L13.8176 22.0008H10.1737L8.05208 20.5688L6.2832 19.1514Z"
        fill="#C0AC9D"
      ></path>
      <path
        d="M13.3312 17.7407L13.8446 18.0954L14.1454 20.4431L13.71 20.0836H10.2904L9.86328 20.4504L10.1543 18.0956L10.6678 17.7407H13.3312Z"
        fill="#161616"
      ></path>
      <path
        d="M22.7629 0.205566L23.9991 3.8327L23.2271 7.50019L23.7768 7.91492L23.0329 8.47003L23.592 8.89238L22.8517 9.55175L23.3062 9.87369L22.1 11.2515L17.1528 9.8426L17.11 9.82014L13.5449 6.87878L22.7629 0.205566Z"
        fill="#763E1A"
      ></path>
      <path
        d="M1.23619 0.205566L10.4543 6.87878L6.88914 9.82014L6.8463 9.8426L1.8991 11.2515L0.692814 9.87369L1.14694 9.55202L0.407064 8.89238L0.965065 8.47058L0.210001 7.91382L0.780471 7.49881L0 3.83289L1.23619 0.205566Z"
        fill="#763E1A"
      ></path>
      <path
        d="M16.9113 9.53564L22.1531 11.0284L23.8561 16.1619H19.3632L16.2676 16.2001L18.5189 11.908L16.9113 9.53564Z"
        fill="#F5841F"
      ></path>
      <path
        d="M7.08771 9.53564L5.4798 11.908L7.7314 16.2001L4.63717 16.1619H0.152344L1.84575 11.0284L7.08771 9.53564Z"
        fill="#F5841F"
      ></path>
      <path
        d="M15.3182 3.03574L13.852 6.9088L13.5409 12.1409L13.4218 13.7808L13.4125 17.9701H10.5894L10.5803 13.7887L10.4608 12.1395L10.1496 6.9088L8.68359 3.03564L15.3182 3.03574Z"
        fill="#F5841F"
      ></path>
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
