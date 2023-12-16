/* eslint-disable @typescript-eslint/no-unused-vars */
import { Suspense, lazy, useMemo, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import './App.css';
// import CssBaseline from '@mui/material/CssBaseline';
import { blueGrey } from '@mui/material/colors';
import { BlockProvider } from './contexts/BlockContext';
import { CoinProvider } from './contexts/CoinContext';
import { UserProvider } from './contexts/UserContext';
import { WalletProvider } from './contexts/WalletContext';
import Header from './components/Header';
import NewsFeed from './components/NewsFeed';
import Sidebar from './components/Sidebar';

const DynamicLoader = ({ component }: { component: string }) => {
  const LazyComponent = useMemo(
    () => lazy(() => import(`./routes/${component}.tsx`)),
    [component]
  );
  return (
    <Suspense fallback={<CircularProgress />}>
      <LazyComponent />
    </Suspense>
  );
};

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
export const drawerWidth = isMobile ? innerWidth : 240;
export const closedDrawerWidth = 65;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create(['margin', 'max-width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: `calc(100vw - ${closedDrawerWidth}px)`,
  minHeight: '100vh',
  overflow: 'hidden',
  ...(open && {
    transition: theme.transitions.create(['margin', 'max-width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    maxWidth: `calc(100% - ${drawerWidth}px)`,
  }),
}));

function App() {
  const [isOpen, setIsOpen] = useState(!isMobile);
  return (
    <>
      {/* <CssBaseline /> */}
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
                  <Header open={isOpen} />
                  <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
                  <Main open={isOpen}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      mt={3}
                      component="div"
                    >
                      <NewsFeed />
                      <Routes>
                        <Route
                          path="/"
                          element={<DynamicLoader component="Home" />}
                        />
                        {/* <Route path="/bubbles" element={<Bubbles />} /> */}
                        <Route
                          path="/nostr"
                          element={<DynamicLoader component="Nostr" />}
                        />
                        <Route
                          path="/swap"
                          element={<DynamicLoader component="Swap" />}
                        />
                        <Route
                          path="/password-reset"
                          element={<DynamicLoader component="PasswordReset" />}
                        />
                        <Route
                          path="/welcome"
                          element={<DynamicLoader component="WelcomeRoute" />}
                        />
                        <Route
                          path="/terms-and-conditions"
                          element={<DynamicLoader component="TermsRoute" />}
                        />
                        <Route
                          path="/privacy-policy"
                          element={<DynamicLoader component="PrivacyRoute" />}
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
    </>
  );
}

export default App;
