import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import './App.css';
// import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { BlockProvider } from './contexts/BlockContext';
import { CoinProvider } from './contexts/CoinContext';
import { UserProvider } from './contexts/UserContext';
import { WalletProvider } from './contexts/WalletContext';
import Home from './routes/Home';
import Bubbles from './routes/Bubbles';
import Nostr from './routes/Nostr';
import ExplorerRoute from './routes/ExplorerRoute';
import PasswordReset from './routes/PasswordReset';
import Swap from './routes/Swap';
import Header from './components/Header';
import NewsFeed from './components/NewsFeed';
import Sidebar from './components/Sidebar';
import { blueGrey } from '@mui/material/colors';

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

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            background: blueGrey[800],
            color: blueGrey[400],
          },
        },
      },
    },
  },
});

const innerWidth = window.innerWidth;
const isMobile = innerWidth <= 375;
const drawerWidth = isMobile ? innerWidth : 200;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create(['margin', 'max-width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  maxWidth: '100vw',
  minHeight: '100vh',
  marginLeft: `-${drawerWidth}px`,
  overflow: 'hidden',
  ...(open && {
    transition: theme.transitions.create(['margin', 'max-width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
    maxWidth: `calc(100% - ${drawerWidth}px)`,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  background: 'transparent',
  backdropFilter: 'blur(15px)',
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
  const [isOpen, setIsOpen] = useState(!isMobile);
  console.log(import.meta.env.VITE_BLOCKCHAIR_KEY);
  return (
    <ThemeProvider theme={theme}>
      <WalletProvider>
        <UserProvider>
          <CoinProvider>
            <BlockProvider>
              <Box
                display="flex"
                component="div"
                sx={{
                  background: 'linear-gradient(0deg, #a7ffaa -200%, #242424)',
                }}
              >
                <AppBar position="fixed" open={isOpen}>
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
                    <Header />
                  </Toolbar>
                </AppBar>
                <Sidebar
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  drawerWidth={drawerWidth}
                />
                <Main open={isOpen}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    mt={3}
                    component="div"
                  >
                    <NewsFeed />
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/bubbles" element={<Bubbles />} />
                      <Route path="/nostr" element={<Nostr />} />
                      <Route path="/explorer" element={<ExplorerRoute />} />
                      <Route path="/swap" element={<Swap />} />
                      <Route
                        path="/password-reset"
                        element={<PasswordReset />}
                      />
                    </Routes>
                  </Box>
                </Main>
              </Box>
            </BlockProvider>
          </CoinProvider>
        </UserProvider>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;
