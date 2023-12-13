import { Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Badge,
  Drawer as MuiDrawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Snackbar,
  styled,
  Theme,
  CSSObject,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MailIcon from '@mui/icons-material/Mail';
import BoltIcon from '@mui/icons-material/Bolt';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import TimelineIcon from '@mui/icons-material/Timeline';
import ListItemText from '@mui/material/ListItemText';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import LoginIcon from '@mui/icons-material/Login';
import { UserContext } from '../contexts/UserContext';
import AuthDialog from './AuthDialog';
import NotificationDialog from './NotificationDialog';
import { Coin } from '../types/Coin';
import { CoinContext } from '../contexts/CoinContext';
import { ViewInAr } from '@mui/icons-material';
import { WalletContext } from '../contexts/WalletContext';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiPaper-root': {
    background: 'transparent',
    height: '100vh',
    display: 'flex',
    justifyContent: 'space-between',
  },
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { isWalletConnected, setIsWalletConnected } = useContext(WalletContext);
  const { pathname } = useLocation();
  const userContext = useContext(UserContext);
  const {
    coins,
    // selectedCoin,
    // setSelectedCoin,
    // fetchLiveCoinWatch,
    // liveCoinWatchData,
  } = useContext(CoinContext);
  const navigate = useNavigate();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState<boolean>(false);
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState<boolean>(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] =
    useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const TopMenuItems = useMemo(
    () => [
      {
        name: 'Dashboard',
        handleClick: () => navigate('/'),
        icon: <TimelineIcon color="primary" />,
        path: '/',
      },
      {
        name: 'Swap',
        handleClick: () => navigate('/swap'),
        icon: <SwapVertIcon color="primary" />,
        path: '/swap',
      },
      {
        name: 'Nostr',
        handleClick: () => navigate('/nostr'),
        icon: <BoltIcon color="primary" />,
        path: '/nostr',
      },
      {
        name: 'Explorer',
        handleClick: () => navigate('/explorer'),
        icon: <ViewInAr color="primary" />,
        path: '/explorer',
        isBeta: true,
      },
      {
        name: 'Notifications',
        handleClick: () => setIsNotificationDialogOpen(true),
        icon: <MailIcon color="primary" />,
      },
    ],
    [setIsNotificationDialogOpen, navigate]
  );

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
      const loggedInUser = localStorage.getItem('user');
      userContext.getNotifications(loggedInUser);
    }
  };

  // const handleCoinClick = (_coin: string) => {
  //   const [coin] = coins.filter((c) => c.name === _coin);
  //   setSelectedCoin(coin);
  //   fetchLiveCoinWatch(coin.symbol, '24hr');
  // };

  const handleDisconnect = async () => {
    const swapkitImport = await import('../utils/swapKit');
    if (isWalletConnected) {
      swapkitImport.connectChains.map((chain) =>
        swapkitImport.swapKitClient.disconnectChain(chain)
      );
    }
    localStorage.clear();
    userContext.setUser(null);
    await fetch('/api/logout');
    setIsWalletConnected(false);
  };

  const handleAuthDialogClose = (isConnected: boolean | null) => {
    setIsLoginDialogOpen(false);
    if (isConnected) setIsWalletConnected(isConnected);
  };

  return (
    <Drawer variant="permanent" open={isOpen}>
      <DrawerHeader>
        <IconButton onClick={() => setIsOpen(!isOpen)}>
          {!isOpen ? (
            <ChevronRightIcon color="primary" />
          ) : (
            <ChevronLeftIcon color="primary" />
          )}
        </IconButton>
      </DrawerHeader>
      <List>
        {TopMenuItems.map((menuItem) => (
          <ListItem key={menuItem.name} disablePadding>
            <ListItemButton
              onClick={() => {
                menuItem.handleClick();
              }}
              selected={pathname === menuItem.path}
            >
              <ListItemIcon>{menuItem.icon}</ListItemIcon>
              {menuItem.isBeta ? (
                <Badge badgeContent="BETA" color="success">
                  <ListItemText
                    primary={menuItem.name}
                    sx={{
                      color: (theme) => theme.palette.primary.main,
                    }}
                  />
                </Badge>
              ) : (
                <ListItemText
                  primary={menuItem.name}
                  sx={{
                    color: (theme) => theme.palette.primary.main,
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List>
        {isWalletConnected || userContext.user ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleDisconnect}
                alignItems="center"
                sx={[
                  {
                    background: (theme) => theme.palette.primary.dark,
                    border: () => `1px solid white`,
                    borderRadius: 2,
                    m: 1,
                  },
                  {
                    '&:hover': {
                      border: (theme) =>
                        `1px solid ${theme.palette.primary.dark}`,
                    },
                  },
                ]}
              >
                <ListItemText
                  primary="Disconnect"
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </>
        ) : null}
        {
          !userContext.user && !isWalletConnected ? (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => setIsSignupDialogOpen(true)}
                  alignItems="center"
                  sx={[
                    {
                      background: 'transparent',
                      border: () => `1px solid white`,
                      borderRadius: 2,
                      m: 1,
                    },
                    {
                      '&:hover': {
                        border: (theme) =>
                          `1px solid ${theme.palette.primary.dark}`,
                      },
                    },
                  ]}
                >
                  <ListItemIcon>
                    <PersonAddAlt1Icon htmlColor="white" />
                  </ListItemIcon>
                  {isOpen && (
                    <ListItemText
                      primary="Sign Up"
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => setIsLoginDialogOpen(true)}
                  alignItems="center"
                  sx={[
                    {
                      background: (theme) => theme.palette.primary.dark,
                      border: () => `1px solid white`,
                      borderRadius: 2,
                      m: 1,
                    },
                    {
                      '&:hover': {
                        border: (theme) =>
                          `1px solid ${theme.palette.primary.dark}`,
                      },
                    },
                  ]}
                >
                  <ListItemIcon>
                    <LoginIcon htmlColor="white" />
                  </ListItemIcon>
                  {isOpen && (
                    <ListItemText
                      primary="Sign In"
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </>
          ) : null
          // <>
          //   <Typography color="primary">Favorites</Typography>
          //   <Box
          //     boxShadow="inset 0 0 15px rgba(0,0,0,0.5)"
          //     m={2}
          //     p={2}
          //     flex={1}
          //     borderRadius={2}
          //     display="flex"
          //     flexDirection="column"
          //     justifyContent="space-between"
          //     component="div"
          //   >
          //     {userContext.favoriteCoins.map((coin) => {
          //       return (
          //         <Box key={coin} mb={1} component="div">
          //           <Button
          //             color="primary"
          //             onClick={() => handleCoinClick(coin)}
          //             variant="outlined"
          //             fullWidth
          //             disabled={
          //               (!!selectedCoin && selectedCoin.name === coin) ||
          //               liveCoinWatchData?.name === coin
          //             }
          //           >
          //             {coin}
          //           </Button>
          //         </Box>
          //       );
          //     })}
          //   </Box>
          //   <ListItemButton
          //     onClick={() => handleLogout()}
          //     alignItems="center"
          //   >
          //     <ListItemText
          //       primary={(isConnected && address) || 'Sign Out'}
          //       sx={{
          //         display: 'flex',
          //         justifyContent: 'center',
          //         color: (theme) => theme.palette.primary.main,
          //       }}
          //     />
          //   </ListItemButton>
          // </>
        }
      </List>
      <AuthDialog
        open={isLoginDialogOpen}
        onClose={handleAuthDialogClose}
        onSubmit={handleLoginDialogSubmit}
        mode="login"
      />
      <AuthDialog
        open={isSignupDialogOpen}
        onClose={() => setIsSignupDialogOpen(false)}
        onSubmit={handleSignupDialogSubmit}
        mode="signup"
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
    </Drawer>
  );
};

export default Sidebar;
