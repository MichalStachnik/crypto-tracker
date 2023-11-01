import { Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Snackbar,
  Typography,
  styled,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MailIcon from '@mui/icons-material/Mail';
import BoltIcon from '@mui/icons-material/Bolt';
import ListItemText from '@mui/material/ListItemText';
import { UserContext } from '../contexts/UserContext';
import AuthDialog from './AuthDialog';
import NotificationDialog from './NotificationDialog';
import { Coin } from '../types/Coin';
import { CoinContext } from '../contexts/CoinContext';
import { ViewInAr } from '@mui/icons-material';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  drawerWidth: number;
  coins: Coin[];
}

const Sidebar = ({ isOpen, setIsOpen, drawerWidth, coins }: SidebarProps) => {
  const userContext = useContext(UserContext);
  const {
    selectedCoin,
    setSelectedCoin,
    fetchLiveCoinWatch,
    liveCoinWatchData,
  } = useContext(CoinContext);
  const navigate = useNavigate();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState<boolean>(false);
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState<boolean>(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] =
    useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const AdminMenuItems = useMemo(
    () => [
      {
        name: 'Login',
        handleClick: () => setIsLoginDialogOpen(true),
      },
      {
        name: 'Signup',
        handleClick: () => setIsSignupDialogOpen(true),
      },
    ],
    [setIsSignupDialogOpen]
  );

  const TopMenuItems = useMemo(
    () => [
      {
        name: 'Notifications',
        handleClick: () => setIsNotificationDialogOpen(true),
        icon: <MailIcon color="primary" />,
      },
      {
        name: 'Nostr',
        handleClick: () => navigate('/nostr'),
        icon: <BoltIcon color="primary" />,
      },
      {
        name: 'Explorer',
        handleClick: () => navigate('/explorer'),
        icon: <ViewInAr color="primary" />,
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
    if (response.status === 200) {
      setIsSnackbarOpen(true);
      setIsNotificationDialogOpen(false);
    }
  };

  const handleCoinClick = (_coin: string) => {
    const [coin] = coins.filter((c) => c.name === _coin);
    setSelectedCoin(coin);
    fetchLiveCoinWatch(coin.symbol, '24hr');
  };

  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'transparent',
            display: 'flex',
            justifyContent: 'space-between',
            boxShadow: (theme) => theme.shadows[4],
          },
        }}
        variant="persistent"
        anchor="left"
        open={isOpen}
      >
        <DrawerHeader>
          <IconButton onClick={() => setIsOpen(false)}>
            <ChevronLeftIcon color="primary" />
            {/* {theme.direction === 'ltr' ? (
                  
                ) : (
                  <ChevronRightIcon />
                )} */}
          </IconButton>
        </DrawerHeader>
        <List>
          {TopMenuItems.map((menuItem) => (
            <ListItem key={menuItem.name} disablePadding>
              <ListItemButton
                onClick={() => {
                  menuItem.handleClick();
                }}
              >
                <ListItemIcon>{menuItem.icon}</ListItemIcon>
                <ListItemText
                  primary={menuItem.name}
                  sx={{
                    color: (theme) => theme.palette.primary.main,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <List>
          {!userContext.user ? (
            <>
              {AdminMenuItems.map((menuItem) => (
                <ListItem key={menuItem.name} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      menuItem.handleClick();
                    }}
                    alignItems="center"
                  >
                    <ListItemText
                      primary={menuItem.name}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        color: (theme) => theme.palette.primary.main,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </>
          ) : (
            <>
              <Typography color="primary">Favorites</Typography>
              <Box
                boxShadow="inset 0 0 15px rgba(0,0,0,0.5)"
                m={2}
                p={2}
                flex={1}
                borderRadius={2}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
              >
                {userContext.favoriteCoins.map((coin) => {
                  return (
                    <Box key={coin} mb={1}>
                      <Button
                        color="primary"
                        onClick={() => handleCoinClick(coin)}
                        variant="outlined"
                        fullWidth
                        disabled={
                          (!!selectedCoin && selectedCoin.name === coin) ||
                          liveCoinWatchData?.name === coin
                        }
                      >
                        {coin}
                      </Button>
                    </Box>
                  );
                })}
              </Box>
              <ListItemButton
                onClick={() => handleLogout()}
                alignItems="center"
              >
                <ListItemText
                  primary="Logout"
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    color: (theme) => theme.palette.primary.main,
                  }}
                />
              </ListItemButton>
            </>
          )}
        </List>
        <AuthDialog
          open={isLoginDialogOpen}
          onClose={() => setIsLoginDialogOpen(false)}
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
    </>
  );
};

export default Sidebar;
