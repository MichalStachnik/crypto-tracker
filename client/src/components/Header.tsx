import { ChangeEvent, useState, MouseEvent, useContext } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
// import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
// import MoreIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Snackbar,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { UserContext } from '../contexts/UserContext';

const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const styleCell = (percentChange: number) => {
  if (percentChange > 0) {
    return { color: 'green' };
  } else if (percentChange < 0) {
    return { color: 'red' };
  } else {
    return { color: 'black' };
  }
};

const StyledLogo = styled(Typography)(({ theme }) => ({
  backgroundImage:
    'linear-gradient(90deg, rgb(255,255,255) 0%, rgba(136,132,216,1) 99%)',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: ({ email, password }: { email: string; password: string }) => void;
  mode: 'login' | 'signup';
}

function AuthDialog(props: AuthDialogProps) {
  const { onClose, open, onSubmit, mode } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        <FormHelperText sx={{ m: 1 }} id="my-helper-text">
          We'll never share your email.
        </FormHelperText>
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

export interface NotificationDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: ({
    coin,
    price,
  }: {
    coin: '' | HTMLSelectElement | undefined;
    price: number;
  }) => void;
  coins: Coin[];
}

function NotificationDialog(props: NotificationDialogProps) {
  const { onClose, open, onSubmit, coins } = props;
  const userContext = useContext(UserContext);
  const [coin, setCoin] = useState<'' | HTMLSelectElement | undefined>('');
  const [price, setPrice] = useState<number | null>(0);

  const handleClose = () => {
    onClose();
  };

  const handleCoinChange = (e: SelectChangeEvent<HTMLSelectElement>) => {
    setCoin(e.target.value as HTMLSelectElement);
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(e.target.value));
  };

  const handleSubmit = () => {
    if (!price) return;
    onSubmit({ coin, price });
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle display="flex" flexDirection="column">
        {!userContext.user ? (
          <Box>Need to be logged in to set notifications</Box>
        ) : (
          <>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Coin</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={coin}
                label="Coin"
                onChange={handleCoinChange}
              >
                {coins.map((coin: Coin) => {
                  return (
                    <MenuItem value={coin.name} key={coin.name}>
                      {coin.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Price
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type="number"
                label="Price"
                value={price?.toFixed(0)}
                onChange={handlePriceChange}
              />
            </FormControl>
            <Button
              variant="contained"
              onClick={handleSubmit}
              style={{ marginTop: 15 }}
            >
              Set Notification
            </Button>
          </>
        )}
      </DialogTitle>
    </Dialog>
  );
}

interface Coin {
  name: string;
}

export default function Header({
  globalData,
  searchText,
  setSearchText,
  coins,
}: any) {
  const userContext = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] =
    useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  // const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
  //   setMobileMoreAnchorEl(event.currentTarget);
  // };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const handleSearch = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchText(event.target.value);
  };

  const handleSignup = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    // TODO: check res and tell user to check email or login
  };

  const handleSignupDialogSubmit = ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    handleSignup({ email, password });
    setIsSignupDialogOpen(false);
  };

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    localStorage.setItem('user', data.data.user.session.access_token);
    userContext.setUser(data.data.user.session.access_token);
    const newFavorites = data.data.favorites.map((c: Coin) => c.name);
    userContext.setFavoriteCoins(newFavorites);
  };

  const handleLoginDialogSubmit = ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    handleLogin({ email, password });
    setIsLoginDialogOpen(false);
  };

  const handleLogout = async () => {
    localStorage.clear();
    userContext.setUser(null);
    await fetch('/api/logout');
  };

  const handleNotificationSubmit = async ({
    coin,
    price,
  }: {
    coin: '' | HTMLSelectElement | undefined;
    price: number;
  }) => {
    const response = await fetch('/api/add-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jwt: userContext.user, coin, price }),
    });
    if (response.status === 200) setIsSnackbarOpen(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }} mb={4}>
      <AppBar position="static" sx={{ bgcolor: 'black' }}>
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <StyledLogo variant="h6" noWrap fontWeight="bold">
            wm
          </StyledLogo>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchText}
              onChange={handleSearch}
            />
          </Search>
          <Box>
            {Object.keys(globalData).length && !globalData['error'] ? (
              <Box display="flex">
                <Box
                  flexDirection="column"
                  sx={{ display: { xs: 'none', md: 'flex' } }}
                >
                  <Typography>Bitcoin dominance</Typography>
                  <Typography>
                    {globalData.bitcoin_dominance_percentage.toFixed(2)}%
                  </Typography>
                </Box>
                <Box
                  flexDirection="column"
                  sx={{ display: { xs: 'none', md: 'flex' } }}
                >
                  <Typography>Market cap</Typography>
                  <Typography fontSize="0.8rem">
                    {USDollar.format(globalData.market_cap_usd.toFixed(0))}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column">
                  <Typography>Market cap change 24hr</Typography>
                  <Typography
                    style={styleCell(globalData.market_cap_change_24h)}
                    fontWeight="bold"
                  >
                    {globalData.market_cap_change_24h.toFixed(2)}%
                  </Typography>
                </Box>
              </Box>
            ) : null}
          </Box>
          <Box>
            <Badge color="success" badgeContent={'New'}>
              <Button onClick={() => setIsNotificationDialogOpen(true)}>
                <NotificationsIcon />
                <Typography textTransform="capitalize">
                  Notifications
                </Typography>
              </Button>
            </Badge>
          </Box>
          {!userContext.user ? (
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'flex-end',
                flex: 1,
              }}
            >
              <Button
                variant="outlined"
                style={{ marginRight: 10 }}
                onClick={() => setIsLoginDialogOpen(true)}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => setIsSignupDialogOpen(true)}
              >
                Signup
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>
              <Button variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      <AuthDialog
        open={isSignupDialogOpen}
        onClose={() => setIsSignupDialogOpen(false)}
        onSubmit={handleSignupDialogSubmit}
        mode="signup"
      />
      <AuthDialog
        open={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
        onSubmit={handleLoginDialogSubmit}
        mode="login"
      />
      <NotificationDialog
        open={isNotificationDialogOpen}
        onClose={() => setIsNotificationDialogOpen(false)}
        onSubmit={handleNotificationSubmit}
        coins={coins}
      />
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setIsSnackbarOpen(false)}
        message="Notification Set"
      />
    </Box>
  );
}
