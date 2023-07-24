import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import Bubbles from './routes/Bubbles';
import './App.css';
import Header from './components/Header';
import NewsFeed from './components/NewsFeed';
import { UserProvider } from './contexts/UserContext';
import { CoinProvider } from './contexts/CoinContext';
import { Coin } from './types/Coin';
import { Box } from '@mui/material';
import PasswordReset from './routes/PasswordReset';

// const DynamicLoader = ({ component }: { component: string }) => {
//   const LazyComponent = useMemo(
//     () => lazy(() => import(`routes/${component}`)),
//     [component]
//   );
//   return (
//     <Suspense fallback={<Ellipsis />}>
//       <LazyComponent />
//     </Suspense>
//   );
// };

function App() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [globalData, setGlobalData] = useState({});
  const [searchText, setSearchText] = useState<string>('');

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
        <Header
          globalData={globalData}
          searchText={searchText}
          setSearchText={setSearchText}
          coins={coins}
        />
        <NewsFeed />
        <Routes>
          <Route path="/" element={<Home coins={coins} />} />
          <Route path="/bubbles" element={<Bubbles coins={coins} />} />
          <Route path="/password-reset" element={<PasswordReset />} />
        </Routes>
      </CoinProvider>
    </UserProvider>
  );
}

export default App;
