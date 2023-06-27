import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import { UserProvider } from './contexts/UserContext';
import { Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import Bubbles from './routes/Bubbles';
import { Coin } from './types/Coin';

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
      <Header
        globalData={globalData}
        searchText={searchText}
        setSearchText={setSearchText}
        coins={coins}
      />
      <Routes>
        <Route
          path="/"
          element={<Home coins={coins} searchText={searchText} />}
        />
        <Route path="/bubbles" element={<Bubbles coins={coins} />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
