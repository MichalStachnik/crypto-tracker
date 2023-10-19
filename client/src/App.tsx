import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import Bubbles from './routes/Bubbles';
import './App.css';
import Header from './components/Header';
import NewsFeed from './components/NewsFeed';
import { UserProvider } from './contexts/UserContext';
import { CoinProvider } from './contexts/CoinContext';
import { Coin } from './types/Coin';
import PasswordReset from './routes/PasswordReset';
import { Box } from '@mui/material';
// import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './components/Sidebar';

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
          <Sidebar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            drawerWidth={drawerWidth}
            coins={coins}
          />
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
      </CoinProvider>
    </UserProvider>
  );
}

export default App;
