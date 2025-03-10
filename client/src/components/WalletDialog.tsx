import { useContext, useState } from 'react';
import { WalletOption } from '@swapkit/sdk';
import { Box, Button, Dialog, DialogTitle, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { WalletContext } from '../contexts/WalletContext';
import { XDefiWalletLogo } from './svg/XDefiWalletLogo';
import { MetamaskWalletLogo } from './svg/MetamaskWalletLogo';

export interface WalletDialogProps {
  open: boolean;
  onClose: (isConnected: boolean | null) => void;
}

export function WalletDialog(props: WalletDialogProps) {
  const { onClose, open } = props;
  const { setConnectedChains } = useContext(WalletContext);
  const [selectedWallet, setSelectedWallet] = useState<WalletOption | null>(
    null
  );
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);

  const handleConnect = async () => {
    setIsWalletConnecting(true);
    if (!selectedWallet) return;
    const swapkitImport = await import('../utils/swapKit');
    switch (selectedWallet) {
      case WalletOption.METAMASK: {
        await swapkitImport.connectEVMWallet(WalletOption.METAMASK);
        break;
      }
      case WalletOption.XDEFI: {
        await swapkitImport.connectXDEFI();
        break;
      }
    }
    const connectedChains = swapkitImport.getConnectedChains();
    setConnectedChains(connectedChains);

    setIsWalletConnecting(false);
    onClose(true);
  };

  const handleClose = () => {
    onClose(null);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{
        sx: {
          bgcolor: '#242424cc',
        },
      }}
    >
      <DialogTitle display="flex" flexDirection="column">
        <Typography align="center" mt={2} color="primary">
          Connect your Wallet
        </Typography>
        <Box display="flex" justifyContent="space-between" gap={4} my={4}>
          <Button
            onClick={() => setSelectedWallet(WalletOption.XDEFI)}
            component="label"
            variant="outlined"
            startIcon={<XDefiWalletLogo />}
            style={{ marginTop: 15 }}
            disabled={!!selectedWallet && selectedWallet === WalletOption.XDEFI}
          >
            XDefi
          </Button>
          <Button
            onClick={() => setSelectedWallet(WalletOption.METAMASK)}
            component="label"
            variant="outlined"
            startIcon={<MetamaskWalletLogo />}
            style={{ marginTop: 15 }}
            disabled={
              !!selectedWallet && selectedWallet === WalletOption.METAMASK
            }
          >
            Metamask
          </Button>
        </Box>
        <LoadingButton
          loading={isWalletConnecting}
          variant="contained"
          onClick={handleConnect}
          style={{ marginTop: 15 }}
          disabled={!selectedWallet}
        >
          Connect Wallet
        </LoadingButton>
      </DialogTitle>
    </Dialog>
  );
}

export default WalletDialog;
