import {
  Avatar,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { Token } from '../types/Token';

export interface TokensDialogProps {
  open: boolean;
  onClose: (token: Token | null) => void;
  availableTokens: Token[];
}

function TokensDialog(props: TokensDialogProps) {
  const { onClose, open, availableTokens } = props;

  const handleClose = () => {
    onClose(null);
  };

  const handleListItemClick = (t: Token) => {
    onClose(t);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Choose a token</DialogTitle>
      <List sx={{ pt: 0 }}>
        {availableTokens
          .filter((_, index) => index <= 2)
          .map((token) => (
            <ListItem disableGutters key={token.ticker}>
              <ListItemButton onClick={() => handleListItemClick(token)}>
                <ListItemAvatar>
                  <Avatar src={token.img} />
                </ListItemAvatar>
                <ListItemText primary={token.name} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </Dialog>
  );
}

export default TokensDialog;
