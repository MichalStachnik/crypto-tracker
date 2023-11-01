import {
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';

interface NotificationItemProps {
  notification: any;
  onNotificationSave: (notification: any) => void;
  onNotificationDelete: (notification: any) => void;
}

const NotificationItem = ({
  notification,
  onNotificationSave,
  onNotificationDelete,
}: NotificationItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState(notification.price);

  const handleSave = () => {
    setIsEditing(false);
    const newNotification = {
      ...notification,
      price,
    };
    onNotificationSave(newNotification);
  };

  const handleNotificationDelete = (notification: any) => {
    onNotificationDelete(notification);
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(e.target.value));
  };

  return (
    <Box
      key={notification.created_at}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box display="flex" alignItems="center">
        <Typography mr={1}>{notification.coin}</Typography>
        {isEditing ? (
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
        ) : (
          <Typography ml={1}>{notification.price}</Typography>
        )}
      </Box>
      <Box display="flex">
        {isEditing ? (
          <>
            <Button onClick={() => handleSave()}>Save</Button>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
            <Button onClick={() => handleNotificationDelete(notification)}>
              Delete
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default NotificationItem;
