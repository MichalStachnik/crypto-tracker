import { ChangeEvent, useState, useContext } from 'react';
import Typography from '@mui/material/Typography';
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
  const userContext = useContext(UserContext);
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
  };

  const handleNotificationEdit = (notification: any) => {
    console.log(notification);
  };

  const handleNotificationDelete = (notification: any) => {
    console.log(notification);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle display="flex" flexDirection="column">
        {!userContext.user ? (
          <Box>You need to be logged in to set notifications</Box>
        ) : (
          <>
            <Box>
              {userContext.notifications.map((notification) => {
                return (
                  <Box key={notification.created_at}>
                    <Typography>
                      {notification.coin} {notification.price}
                    </Typography>
                    <Button
                      onClick={() => handleNotificationEdit(notification)}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleNotificationDelete(notification)}
                    >
                      Delete
                    </Button>
                  </Box>
                );
              })}
            </Box>
            <FormControl fullWidth>
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
            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Price
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
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
