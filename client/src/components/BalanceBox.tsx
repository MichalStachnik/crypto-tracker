import { Box, Typography } from '@mui/material';
import { AssetValue, Chain, formatBigIntToSafeValue } from '@swapkit/sdk';
import { UserWallet } from '../types/UserWallet';
import { Token } from '../types/Token';
import { useEffect, useState } from 'react';

interface EnumMapper {
  [key: string]: string;
}

const enumMapper: EnumMapper = {
  ETH: 'Ethereum',
  BTC: ' Bitcoin',
};

const BalanceBox = ({
  token,
  userWallets,
}: {
  token: Token;
  userWallets: UserWallet[] | null;
}) => {
  const [userBalance, setUserBalance] = useState<string | null>(null);

  useEffect(() => {
    const getUserBalance = async () => {
      if (!userWallets) return;
      const chainName = enumMapper[token.chain];
      const chain = Chain[chainName as keyof typeof Chain];
      const swapkitImport = await import('../utils/swapKit');
      const address = swapkitImport.client.getAddress(chain);
      const wallet = userWallets.find(
        (wallet: UserWallet) => wallet?.address === address
      );

      const balance = wallet?.balance?.find(
        (balance: AssetValue) => balance.ticker === token.ticker
      );
      if (!balance) {
        setUserBalance('0');
        return;
      }

      const b = formatBigIntToSafeValue({
        value: balance.bigIntValue,
        decimal: balance.decimal,
      });
      setUserBalance(b);
    };
    getUserBalance();
  }, [token, userWallets]);

  if (!userBalance) return null;

  return (
    <Box component="div">
      <Typography align="right" color="primary" fontSize="0.8rem">
        Balance: {userBalance}
      </Typography>
    </Box>
  );
};

export default BalanceBox;
