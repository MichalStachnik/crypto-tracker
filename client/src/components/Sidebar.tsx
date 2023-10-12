import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, Button, Drawer, IconButton } from '@mui/material';
import { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Coin } from '../types/Coin';
import AuthDialog from './AuthDialog';

const Sidebar = () => {
  const userContext = useContext(UserContext);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState<boolean>(false);
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState<boolean>(false);

  const handleLogout = async () => {
    localStorage.clear();
    userContext.setUser(null);
    await fetch('/api/logout');
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

  return (
    <Box>
      <IconButton onClick={() => setIsOpen(true)}>
        <ChevronRight />
      </IconButton>
      <Drawer variant="persistent" anchor="left" open={isOpen}>
        <Box bgcolor="#242424" height="100%">
          {isOpen ? (
            <Box>
              <IconButton onClick={() => setIsOpen(false)}>
                <ChevronLeft />
              </IconButton>

              {!userContext.user ? (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => setIsLoginDialogOpen(true)}
                    // size={theme.breakpoints.down('sm') ? 'small' : 'medium'}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setIsSignupDialogOpen(true)}
                    // size={theme.breakpoints.down('sm') ? 'small' : 'medium'}
                  >
                    Signup
                  </Button>
                </>
              ) : (
                <Button variant="outlined" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </Box>
          ) : null}
        </Box>
      </Drawer>
      <AuthDialog
        open={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
        onSubmit={handleLoginDialogSubmit}
        mode="login"
      />
    </Box>
  );
};

export default Sidebar;
