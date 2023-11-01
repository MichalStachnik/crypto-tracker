import { ChangeEvent, useState, useContext } from 'react';
import MenuItem from '@mui/material/MenuItem';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';

import { UserContext } from '../contexts/UserContext';
import { Coin } from '../types/Coin';
import NotificationItem from './NotificationItem';

export interface NotificationDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: ({
    coin,
    price,
  }: {
    coin: '' | HTMLSelectElement | undefined;
    price: number;
  }) => void;
  coins: Coin[];
}

function NotificationDialog(props: NotificationDialogProps) {
  const { onClose, open, onSubmit, coins } = props;
  const { user, notifications, getNotifications } = useContext(UserContext);
  const [coin, setCoin] = useState<'' | HTMLSelectElement | undefined>('');
  const [price, setPrice] = useState<number | null>(0);

  const handleClose = () => {
    onClose();
  };

  const handleCoinChange = (e: SelectChangeEvent<HTMLSelectElement>) => {
    setCoin(e.target.value as HTMLSelectElement);
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(e.target.value));
  };

  const handleSubmit = () => {
    if (!price) return;
    onSubmit({ coin, price });
    setCoin('');
    setPrice(0);
  };

  const handleNotificationSave = async (notification: any) => {
    const response = await fetch('/api/update-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jwt: user, notification }),
    });

    if (response.status === 200) {
      const loggedInUser = localStorage.getItem('user');
      getNotifications(loggedInUser);
    }
  };

  const handleNotificationDelete = async (notification: any) => {
    console.log('deleting', notification);

    const response = await fetch('/api/delete-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jwt: user, notification }),
    });

    if (response.status === 200) {
      const loggedInUser = localStorage.getItem('user');
      getNotifications(loggedInUser);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle display="flex" flexDirection="column">
        {!user ? (
          <Box>You need to be logged in to set notifications</Box>
        ) : (
          <>
            <Box width={300}>
              {notifications.map((notification) => {
                return (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onNotificationSave={handleNotificationSave}
                    onNotificationDelete={handleNotificationDelete}
                  />
                );
              })}
            </Box>
            <FormControl fullWidth sx={{ my: 2 }}>
              <InputLabel id="coin-label">Coin</InputLabel>
              <Select
                labelId="coin-label"
                id="coin-label"
                value={coin}
                label="Coin"
                onChange={handleCoinChange}
              >
                {coins.map((coin: Coin) => {
                  return (
                    <MenuItem value={coin.name} key={coin.name}>
                      {coin.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ my: 2 }}>
              <InputLabel htmlFor="outlined-adornment-price">Price</InputLabel>
              <OutlinedInput
                id="outlined-adornment-price"
                type="number"
                label="Price"
                value={price?.toFixed(0)}
                onChange={handlePriceChange}
              />
            </FormControl>
            <Button
              variant="contained"
              onClick={handleSubmit}
              style={{ marginTop: 15 }}
            >
              Set Notification
            </Button>
          </>
        )}
      </DialogTitle>
    </Dialog>
  );
}

export default NotificationDialog;
