import { useContext, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import Bubbles from './routes/Bubbles';
import './App.css';
import Header from './components/Header';
import NewsFeed from './components/NewsFeed';
import { UserContext, UserProvider } from './contexts/UserContext';
import { CoinProvider } from './contexts/CoinContext';
import { Coin } from './types/Coin';
import PasswordReset from './routes/PasswordReset';
import { Box } from '@mui/material';
import Drawer from '@mui/material/Drawer';
// import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import AuthDialog from './components/AuthDialog';

// const DynamicLoader = ({ component }: { component: string }) => {
//   const LazyComponent = useMemo(
//     () => lazy(() => import(`routes/${component}`)),
//     [component]
//   );
//   return (
//     <Suspense fallback={<CircularProgress />}>
//       <LazyComponent />
//     </Suspense>
//   );
// };

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  // padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function App() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [globalData, setGlobalData] = useState({});
  const [searchText, setSearchText] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const userContext = useContext(UserContext);

  useEffect(() => {
    fetchGlobal();
    fetchCMC();
  }, []);

  const fetchGlobal = () => {
    fetch('/api/global')
      .then((res) => res.json())
      .then((res) => setGlobalData(res))
      .catch((err) => console.error('Error', err));
  };

  const fetchCMC = () => {
    fetch('/api/cmc')
      .then((res) => res.json())
      .then((res) => setCoins(res.data))
      .catch((err) => console.error('Error', err));
  };

  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState<boolean>(false);
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState<boolean>(false);

  const MenuItems = [
    {
      name: 'Login',
      handleClick: () => setIsLoginDialogOpen(true),
    },
    {
      name: 'Signup',
      handleClick: () => setIsSignupDialogOpen(true),
    },
  ];

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

  return (
    <UserProvider>
      <CoinProvider>
        <Box display="flex">
          <AppBar position="fixed" open={isOpen} sx={{ background: 'black' }}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => setIsOpen(true)}
                edge="start"
                sx={{ mr: 2, ...(isOpen && { display: 'none' }) }}
              >
                <MenuIcon />
              </IconButton>
              <Header
                globalData={globalData}
                searchText={searchText}
                setSearchText={setSearchText}
                coins={coins}
              />
            </Toolbar>
          </AppBar>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                background: (theme) => theme.palette.primary.main,
                display: 'flex',
                justifyContent: 'space-between',
              },
            }}
            variant="persistent"
            anchor="left"
            open={isOpen}
          >
            <DrawerHeader>
              <IconButton onClick={() => setIsOpen(false)}>
                <ChevronLeftIcon />
                {/* {theme.direction === 'ltr' ? (
                  
                ) : (
                  <ChevronRightIcon />
                )} */}
              </IconButton>
            </DrawerHeader>
            <List>
              {['Notifications'].map((text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <List>
              {MenuItems.map((menuItem) => (
                <ListItem key={menuItem.name} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      menuItem.handleClick();
                    }}
                    alignItems="center"
                  >
                    <ListItemText
                      primary={menuItem.name}
                      sx={{ display: 'flex', justifyContent: 'center' }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>
          <Main open={isOpen}>
            <Box display="flex" flexDirection="column" mt={3}>
              <NewsFeed />
              <Routes>
                <Route path="/" element={<Home coins={coins} />} />
                <Route path="/bubbles" element={<Bubbles coins={coins} />} />
                <Route path="/password-reset" element={<PasswordReset />} />
              </Routes>
            </Box>
          </Main>
        </Box>
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
      </CoinProvider>
    </UserProvider>
  );
}

export default App;
