import { useContext, useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  styled,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ListItemText from '@mui/material/ListItemText';
import AuthDialog from './AuthDialog';
import { UserContext } from '../contexts/UserContext';
import { Coin } from '../types/Coin';

// const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Sidebar = ({ isOpen, setIsOpen, drawerWidth }: any) => {
  const userContext = useContext(UserContext);
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

  const handleLogout = async () => {
    localStorage.clear();
    userContext.setUser(null);
    await fetch('/api/logout');
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
          {!userContext.user ? (
            <>
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
            </>
          ) : (
            <ListItemButton onClick={() => handleLogout()} alignItems="center">
              <ListItemText
                primary="Logout"
                sx={{ display: 'flex', justifyContent: 'center' }}
              />
            </ListItemButton>
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
      </Drawer>
    </>
  );
};

export default Sidebar;
