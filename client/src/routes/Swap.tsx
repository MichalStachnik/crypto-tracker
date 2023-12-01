/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';
import {
  Chain,
  WalletOption,
  SwapKitApi,
  FeeOption,
  QuoteRoute,
  AssetValue,
  formatBigIntToSafeValue,
} from '@swapkit/sdk';
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  OutlinedInput,
  Typography,
  styled,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import tokens from '../utils/tokens.json';
import { connectChains, swapKitClient } from '../utils/swapKit';
import { WalletContext } from '../contexts/WalletContext';

const BalanceBox = ({
  token,
  userWallets,
}: {
  token: Token;
  userWallets: any;
}) => {
  const userBalance = useMemo(() => {
    const chain = Chain[token.name as keyof typeof Chain];
    const address = swapKitClient.getAddress(chain);
    const wallet = userWallets.find(
      (wallet: any) => wallet?.address === address
    );

    const balance = wallet?.balance?.find(
      (balance: any) => balance.symbol === token.ticker
    );
    if (!balance) return null;
    return formatBigIntToSafeValue({
      value: balance.bigIntValue,
      decimal: balance.decimal,
    });
  }, [userWallets, token]);

  if (!userBalance) return null;

  return (
    <Box component="div">
      <Typography align="right" color="primary" fontSize="0.8rem">
        Balance: {userBalance}
      </Typography>
    </Box>
  );
};

interface Token {
  ticker: string;
  img: string;
  name: string;
  address: string;
  decimals: number;
}

export interface TokensDialogProps {
  open: boolean;
  onClose: (token: Token | null) => void;
}

function TokensDialog(props: TokensDialogProps) {
  const { onClose, open } = props;

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
        {tokens
          .filter((_, index) => index >= 1)
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

interface Prices {
  token1: number | null;
  token2: number | null;
}

const StyledOutlinedInput = styled(OutlinedInput)(() => ({
  color: 'white',
  fontSize: '0.8rem',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'white',
  },
  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
    display: 'none',
  },
}));

// const getAllowance = async (tokenAddress: string, walletAddress: string) => {
//   try {
//     const data = await fetch(
//       `/api/get-allowance/${tokenAddress}/${walletAddress}`
//     );
//     const { allowance } = await data.json();
//     return Number(allowance);
//   } catch (error) {
//     console.error('error', error);
//   }
// };

// const chainId = 1;

// const apiBaseUrl = 'https://api.1inch.dev/swap/v5.2/' + chainId;
// const apiRequestUrl = (methodName: string, queryParams: any) => {
//   return (
//     apiBaseUrl + methodName + '?' + new URLSearchParams(queryParams).toString()
//   );
// };

// const headers = {
//   headers: { Authorization: 'Bearer YOUR_API_KEY', accept: 'application/json' },
// };

// const buildTxForApproveTradeWithRouter = async (
//   // walletAddress: string,
//   tokenAddress: string,
//   amount: string
// ) => {
//   const url = apiRequestUrl(
//     '/approve/transaction',
//     amount ? { tokenAddress, amount } : { tokenAddress }
//   );

//   const transaction = await fetch(url, headers).then((res) => res.json());

//   // const gasLimit = await web3.eth.estimateGas({
//   //   ...transaction,
//   //   from: walletAddress,
//   // });

//   return {
//     ...transaction,
//     // gas: gasLimit,
//   };
// };

// const broadcastApiUrl =
//   'https://api.1inch.dev/tx-gateway/v1.1/' + chainId + '/broadcast';

// const broadCastRawTransaction = (rawTransaction) => {
//   return fetch(broadcastApiUrl, {
//     method: 'post',
//     body: JSON.stringify({ rawTransaction }),
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: 'Bearer YOUR-API-KEY',
//     },
//   })
//     .then((res) => res.json())
//     .then((res) => {
//       return res.transactionHash;
//     });
// };

// // Sign and post a transaction, return its hash
// const signAndSendTransaction = async (transaction) => {
//   const { rawTransaction } = await web3.eth.accounts.signTransaction(
//     transaction,
//     privateKey
//   );

//   return await broadCastRawTransaction(rawTransaction);
// };

const Swap = () => {
  const { isWalletConnected } = useContext(WalletContext);
  const [inputAmount, setInputAmount] = useState<number | string>('');
  const [outputAmount, setOutputAmount] = useState<number | string>('');
  const [inputToken, setInputToken] = useState<Token>(tokens[0]);
  const [outputToken, setOutputToken] = useState<Token>(tokens[1]);
  const [prices] = useState<Prices>({
    token1: null,
    token2: null,
  });
  const [isTokensDialogOpen, setIsTokensDialogOpen] = useState(false);
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);
  const [mode, setMode] = useState<'input' | 'output'>('input');
  const [txUrl, setTxUrl] = useState('');

  const [userWallets, setUserWallets] = useState<
    ({
      address?: string | undefined;
      balance?: AssetValue[] | undefined;
      walletType?: WalletOption | undefined;
    } | null)[]
  >([]);

  const [bestRoute, setBestRoute] = useState<QuoteRoute | null>(null);

  const createQuoteParams = () => {
    const btcAddress = swapKitClient.getAddress(Chain.Bitcoin);
    const ethAddress = swapKitClient.getAddress(Chain.Ethereum);
    return {
      sellAsset: `${inputToken.ticker}.${inputToken.ticker}`, // must be in the form 'chain.ticker' ex: 'BTC.BTC' | 'ETH.ETH'
      sellAmount: inputAmount.toString(),
      buyAsset: `${outputToken.ticker}.${outputToken.ticker}`,
      senderAddress: inputToken.ticker === 'BTC' ? btcAddress : ethAddress, // wallet to send sell asset
      recipientAddress: outputToken.ticker === 'ETH' ? ethAddress : btcAddress, // wallet to receive buy asset
      slippage: '3',
    };
  };

  const getBestRoute = async () => {
    const quoteParams = createQuoteParams();
    const { routes } = await SwapKitApi.getQuote(quoteParams);
    const bestRoute = routes.find(({ optimal }) => optimal);
    return bestRoute;
  };

  useEffect(() => {
    if (inputAmount) {
      const timeoutId = setTimeout(async () => {
        setIsFetchingQuote(true);
        const bestRoute = await getBestRoute();
        if (!bestRoute) return;
        setBestRoute(bestRoute);
        setIsFetchingQuote(false);
        if (inputAmount) {
          setOutputAmount(bestRoute.expectedOutput);
        }
      }, 500);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputAmount]);

  const handleInputAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setInputAmount('');
      setOutputAmount(0);
      return;
    }
    setInputAmount(Number(e.target.value));
  };

  const handleOutputAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setOutputAmount('');
      setInputAmount(0);
      return;
    }
    setOutputAmount(Number(e.target.value));

    if (e.target.value && prices.token1 !== null && prices.token2 !== null) {
      setInputAmount(
        Number(
          (Number(e.target.value) * (prices.token2 / prices.token1)).toFixed(4)
        )
      );
    }
  };

  const handleChangeInputToken = () => {
    // setIsTokensDialogOpen(true);
    setMode('input');
  };

  const handleChangeOutputToken = () => {
    // setIsTokensDialogOpen(true);
    setMode('output');
  };

  const handleTokensDialogClose = (token: Token | null) => {
    setIsTokensDialogOpen(false);
    if (token === null) return;
    if (mode === 'input') {
      setInputToken(token);
    } else if (mode === 'output') {
      setOutputToken(token);
    }
  };

  const fetchWalletBalances = async () => {
    const wallets = await Promise.all(
      connectChains.map((chain) => swapKitClient.getWalletByChain(chain))
    );
    setUserWallets(wallets);
  };

  useEffect(() => {
    if (!isWalletConnected) return;
    fetchWalletBalances();
  }, [isWalletConnected]);

  // TODO: add 1inch back in
  // const handleSwap = async () => {
  //   if (!address || Number(inputAmount) < 0) return;
  //   // Check is user is allowed to use this token
  //   const allowance = await getAllowance(inputToken.address, address);
  //   // Encountering more than 1 RPS error with 1inch
  //   if (allowance === 0) {
  //     setTimeout(async () => {
  //       const data = await fetch(
  //         `/api/approve-transaction/${
  //           inputToken.address
  //         }/${inputAmount.toString()}`
  //       );
  //       let transaction = await data.json();
  //       console.log('transaction', transaction);
  //       const request = await prepareSendTransaction({
  //         to: transaction.to,
  //         value: parseEther(transaction.value),
  //       });

  //       console.log('prepared request...', request);

  //       transaction = {
  //         ...transaction,
  //         gas: request.gas,
  //       };

  //       const approved = confirm('approve?');

  //       if (approved) {
  //         // const approveTxHash = await signAndSendTransaction(transactionForSign);

  //         const { hash } = await sendTransaction(request);

  //         console.log('Approve tx hash: ', hash);
  //         // Sign and send the transaction
  //       }
  //     }, 1000);
  //   }
  //   // Else we are already allowed to use the token for this wallet
  // };

  // const fetchPrices = async (address1: string, address2: string) => {
  //   const res = await fetch(`/api/tokens-price/${address1}/${address2}`);
  //   const data = await res.json();
  //   setPrices(data);
  // };

  // useEffect(() => {
  //   console.log('fetching');
  //   // fetchPrices(inputToken.address, outputToken.address);
  //   getBestRoute();
  // }, [getBestRoute]);

  const handleMouseDownTokenOne = () => {
    console.log(1);
  };
  const handleMouseDownTokenTwo = () => {
    console.log(2);
  };

  const handleSwapkitSwap = async () => {
    if (!bestRoute) return;
    setIsTransactionLoading(true);

    const quoteParams = createQuoteParams();

    try {
      const txHash = await swapKitClient.swap({
        route: bestRoute,
        recipient: quoteParams.recipientAddress,
        feeOptionKey: FeeOption.Average,
        // FeeOption multiplies current base fee by:
        // Average => 1.2
        // Fast => 1.5
        // Fastest => 2
      });
      const inputChain = Chain[inputToken.name as keyof typeof Chain];
      const explorerUrl = swapKitClient.getExplorerTxUrl(inputChain, txHash);
      setTxUrl(explorerUrl);
    } catch (error) {
      console.error('swap error', error);
    }
    setIsTransactionLoading(false);
  };

  const handleTokenSwitch = () => {
    const curInput = inputToken;
    const curOutput = outputToken;
    setInputToken(curOutput);
    setOutputToken(curInput);
  };

  const isInsufficientBalance = useMemo(() => {
    const inputWallet = userWallets.find((w) =>
      w?.balance?.find((v) => v.ticker === inputToken.ticker)
    );

    const inputBalance = inputWallet?.balance?.find(
      (v) => v.ticker === inputToken.ticker
    );

    if (!inputBalance) return;

    const safeValue = formatBigIntToSafeValue({
      value: inputBalance.bigIntValue,
      decimal: inputBalance.decimal,
    });

    if (Number(safeValue) < Number(inputAmount)) return true;
    return false;
  }, [inputAmount, inputToken, userWallets]);

  const swapButtonText = useMemo(() => {
    if (!isWalletConnected) return 'Connect Wallet';
    if (isInsufficientBalance) return 'Insufficient Funds';
    return 'Swap';
  }, [isWalletConnected, isInsufficientBalance]);

  return (
    <Box component="div" mt={6}>
      <Card
        variant="outlined"
        sx={{
          width: '35vw',
          margin: '0 auto',
          p: 2,
          border: (theme) => `2px solid ${theme.palette.primary.dark}`,
          background: '#242424cc',
        }}
      >
        <CardContent sx={{ p: '8px' }}>
          <FormControl sx={{ my: 1, width: '100%' }} variant="outlined">
            <InputLabel htmlFor="InputAmount" sx={{ color: '#808080' }}>
              Input {inputToken.ticker}
            </InputLabel>
            <StyledOutlinedInput
              id="InputAmount"
              type="number"
              value={inputAmount}
              onChange={handleInputAmountChange}
              placeholder="0"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="input token"
                    onClick={handleChangeInputToken}
                    onMouseDown={handleMouseDownTokenOne}
                    edge="end"
                  >
                    <Avatar src={inputToken.img} />
                  </IconButton>
                </InputAdornment>
              }
              label="InputAmount"
            />
          </FormControl>
          <BalanceBox token={inputToken} userWallets={userWallets} />
          <Box component="div">
            <IconButton onClick={handleTokenSwitch}>
              <ArrowDownwardIcon color="primary" />
            </IconButton>
          </Box>
          <FormControl sx={{ my: 1, width: '100%' }} variant="outlined">
            <InputLabel htmlFor="OutputAmount" sx={{ color: '#808080' }}>
              Output {outputToken.ticker}
            </InputLabel>
            <StyledOutlinedInput
              id="OutputAmount"
              type="number"
              value={outputAmount}
              onChange={handleOutputAmountChange}
              placeholder="0"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="output token"
                    onClick={handleChangeOutputToken}
                    onMouseDown={handleMouseDownTokenTwo}
                    edge="end"
                  >
                    <Avatar src={outputToken.img} />
                  </IconButton>
                </InputAdornment>
              }
              label="OutputAmount"
            />
          </FormControl>
          <BalanceBox token={outputToken} userWallets={userWallets} />
          <Box
            component="div"
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="40px"
          >
            {isFetchingQuote ? (
              <>
                <Typography color="primary" mr={2}>
                  Fetching quote...
                </Typography>
                <CircularProgress />
              </>
            ) : null}
          </Box>
        </CardContent>
        <CardActions>
          <LoadingButton
            size="small"
            loading={isTransactionLoading}
            onClick={handleSwapkitSwap}
            disabled={
              !inputAmount ||
              !outputAmount ||
              !isWalletConnected ||
              isFetchingQuote ||
              isInsufficientBalance
            }
            fullWidth
            variant="outlined"
          >
            {swapButtonText}
          </LoadingButton>
        </CardActions>
      </Card>
      {txUrl ? (
        <Box component="div">
          <Typography>Awesome! Track your transaction here</Typography>
          <Link href={txUrl} target="_blank">
            {txUrl}
          </Link>
        </Box>
      ) : null}
      <TokensDialog
        open={isTokensDialogOpen}
        onClose={handleTokensDialogClose}
      />
    </Box>
  );
};

export default Swap;
