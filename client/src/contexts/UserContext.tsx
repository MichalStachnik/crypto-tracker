'use client';
import { createContext, ReactNode, useEffect, useState } from 'react';

interface UserContextInterface {
  user: string | null;
  setUser: any;
  favoriteCoins: string[];
  setFavoriteCoins: any;
}

const initialState: UserContextInterface = {
  user: null,
  setUser: {},
  favoriteCoins: [],
  setFavoriteCoins: {},
};

export const UserContext = createContext<UserContextInterface>(initialState);

interface UserProviderProps {
  /**
   * The children components of the provider
   */
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<string | null>(null);
  const [favoriteCoins, setFavoriteCoins] = useState<string[]>([]);

  const getFavorites = async (user: string) => {
    const res = await fetch('/api/get-favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user }),
    });

    const data = await res.json();
    // If the jwt is invalid, clear local storage
    // probably expired
    if (data.error && data.error.message) {
      localStorage.clear();
      setUser(null);
      setFavoriteCoins([]);
      return;
    }

    if (data.data.length !== 0) {
      const favorites = data.data.map((coin: any) => coin.name);
      setFavoriteCoins(favorites);
    }
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(loggedInUser);
      getFavorites(loggedInUser);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        favoriteCoins,
        setFavoriteCoins,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
