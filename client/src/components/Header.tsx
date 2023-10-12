import {
  ChangeEvent,
  useState,
  useContext,
  useMemo,
  SyntheticEvent,
} from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Snackbar,
  TextField,
  Theme,
  useTheme,
} from '@mui/material';

import { UserContext } from '../contexts/UserContext';
import { Coin } from '../types/Coin';
import { CoinContext } from '../contexts/CoinContext';
import AuthDialog from './AuthDialog';

const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

const styleCell = (percentChange: number, theme: Theme) => {
  if (percentChange > 0) {
    return { color: theme.palette.success.light };
  } else if (percentChange < 0) {
    return { color: theme.palette.error.light };
  } else {
    return { color: theme.palette.primary.light };
  }
};

export const StyledLogo = styled(Typography)(({ theme }) => ({
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

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    padding: 0,
  },
  '& .MuiInputBase-input.MuiAutocomplete-input': {
    color: 'initial',
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.down('md')]: {
      width: 30,
      color: 'transparent',
      padding: '8px 12px',
      '::placeholder': {
        display: 'none',
      },
      ':focus': {
        width: 100,
        color: 'initial',
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      },
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

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
          <Box>You need to be logged in to set notifications</Box>
        ) : (
          <>
            <Box>
              {userContext.notifications.map((notification) => {
                return (
                  <Typography>
                    {notification.coin} {notification.price}
                  </Typography>
                );
              })}
            </Box>
            <FormControl fullWidth>
              <InputLabel id="coin-label">Coin</InputLabel>
              <Select
                labelId="coin-label"
                id="coin-label"
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

export default function Header({
  globalData,
  searchText,
  setSearchText,
  coins,
}: any) {
  const userContext = useContext(UserContext);
  const { setSelectedCoin, fetchLiveCoinWatch } = useContext(CoinContext);
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] =
    useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  // const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
  //   useState<null | HTMLElement>(null);

  // const isMenuOpen = Boolean(anchorEl);
  // const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const theme = useTheme();

  // const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleMobileMenuClose = () => {
  //   setMobileMoreAnchorEl(null);
  // };

  // const handleMenuClose = () => {
  //   setAnchorEl(null);
  //   handleMobileMenuClose();
  // };

  // const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
  //   setMobileMoreAnchorEl(event.currentTarget);
  // };

  // const menuId = 'primary-search-account-menu';
  // const renderMenu = (
  //   <Menu
  //     anchorEl={anchorEl}
  //     anchorOrigin={{
  //       vertical: 'top',
  //       horizontal: 'right',
  //     }}
  //     id={menuId}
  //     keepMounted
  //     transformOrigin={{
  //       vertical: 'top',
  //       horizontal: 'right',
  //     }}
  //     open={isMenuOpen}
  //     onClose={handleMenuClose}
  //   >
  //     <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
  //     <MenuItem onClick={handleMenuClose}>My account</MenuItem>
  //   </Menu>
  // );

  // const mobileMenuId = 'primary-search-account-menu-mobile';
  // const renderMobileMenu = (
  //   <Menu
  //     anchorEl={mobileMoreAnchorEl}
  //     anchorOrigin={{
  //       vertical: 'top',
  //       horizontal: 'right',
  //     }}
  //     id={mobileMenuId}
  //     keepMounted
  //     transformOrigin={{
  //       vertical: 'top',
  //       horizontal: 'right',
  //     }}
  //     open={isMobileMenuOpen}
  //     onClose={handleMobileMenuClose}
  //   >
  //     <MenuItem>
  //       <IconButton size="large" aria-label="show 4 new mails" color="inherit">
  //         <Badge badgeContent={4} color="error">
  //           <MailIcon />
  //         </Badge>
  //       </IconButton>
  //       <p>Messages</p>
  //     </MenuItem>
  //     <MenuItem>
  //       <IconButton
  //         size="large"
  //         aria-label="show 17 new notifications"
  //         color="inherit"
  //       >
  //         <Badge badgeContent={17} color="error">
  //           <NotificationsIcon />
  //         </Badge>
  //       </IconButton>
  //       <p>Notifications</p>
  //     </MenuItem>
  //     <MenuItem onClick={handleProfileMenuOpen}>
  //       <IconButton
  //         size="large"
  //         aria-label="account of current user"
  //         aria-controls="primary-search-account-menu"
  //         aria-haspopup="true"
  //         color="inherit"
  //       >
  //         <AccountCircle />
  //       </IconButton>
  //       <p>Profile</p>
  //     </MenuItem>
  //   </Menu>
  // );

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

  // const handleLogout = async () => {
  //   localStorage.clear();
  //   userContext.setUser(null);
  //   await fetch('/api/logout');
  // };

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
    if (response.status === 200) {
      setIsSnackbarOpen(true);
      setIsNotificationDialogOpen(false);
    }
  };

  const coinNameSuggestions = useMemo(() => {
    if (!searchText) return [];
    else return coins.map((coin: Coin) => coin.name);
  }, [searchText, coins]);

  const handleAutoCompleteChange = (
    _event: SyntheticEvent<Element, Event>,
    value: unknown
  ) => {
    if (value === null) {
      setSelectedCoin(null);
      setSearchText('');
      return;
    }
    const selectedCoin = coins.find((c: Coin) => c.name === value);
    setSelectedCoin(selectedCoin);
    fetchLiveCoinWatch(selectedCoin.symbol, '24hr');
  };

  return (
    <Box flexGrow={1}>
      <AppBar position="static" sx={{ bgcolor: 'black' }}>
        <Toolbar>
          <StyledLogo variant="h6" noWrap fontWeight="bold">
            wm
          </StyledLogo>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <Autocomplete
              freeSolo
              options={coinNameSuggestions}
              noOptionsText="Search..."
              onChange={handleAutoCompleteChange}
              renderInput={(params: AutocompleteRenderInputParams) => (
                <StyledTextField
                  {...params}
                  placeholder="Search…"
                  value={searchText}
                  onChange={handleSearch}
                />
              )}
            />
          </Search>
          <Box flex={1}>
            {Object.keys(globalData).length && !globalData['error'] ? (
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                gap={1}
              >
                <Box
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  p={1}
                  height="45px"
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                  }}
                >
                  <Typography fontSize="0.8rem">Bitcoin dominance</Typography>
                  <Typography>
                    {globalData.bitcoin_dominance_percentage.toFixed(2)}%
                  </Typography>
                </Box>

                <Box
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  p={1}
                  height="45px"
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                  }}
                >
                  <Typography fontSize="0.8rem">Market cap</Typography>
                  <Typography fontSize="0.8rem">
                    {USDollar.format(globalData.market_cap_usd)}
                  </Typography>
                </Box>
                <Box
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  p={1}
                  height="45px"
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                  }}
                >
                  <Typography fontSize="0.8rem">
                    Market cap &Delta; 24hr
                  </Typography>
                  <Typography
                    style={styleCell(globalData.market_cap_change_24h, theme)}
                    fontWeight="bold"
                  >
                    {globalData.market_cap_change_24h.toFixed(2)}%
                  </Typography>
                </Box>
              </Box>
            ) : null}
          </Box>
          {/* <Box display="flex" justifyContent="space-evenly" flex={0.6} gap={1}> */}
          {/* <Badge
              color="success"
              badgeContent={'New'}
              sx={{ display: { xs: 'none', md: 'flex' } }}
            > */}
          {/* <Button
              onClick={() => setIsNotificationDialogOpen(true)}
              variant="outlined"
            >
              <NotificationsIcon fontSize="small" />
              <Typography textTransform="capitalize">Notifications</Typography>
            </Button> */}
          {/* </Badge> */}
          {/* {!userContext.user ? (
              <>
                <Button
                  variant="outlined"
                  onClick={() => setIsLoginDialogOpen(true)}
                  size={theme.breakpoints.down('sm') ? 'small' : 'medium'}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setIsSignupDialogOpen(true)}
                  size={theme.breakpoints.down('sm') ? 'small' : 'medium'}
                >
                  Signup
                </Button>
              </>
            ) : (
              <Button variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
            )} */}
          {/* </Box> */}
        </Toolbar>
      </AppBar>
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
