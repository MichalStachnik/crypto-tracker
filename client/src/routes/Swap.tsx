import { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';
import {
  Chain,
  SwapKitApi,
  FeeOption,
  QuoteRoute,
  formatBigIntToSafeValue,
} from '@swapkit/sdk';
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  Link,
  Typography,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import tokens from '../utils/tokens.json';
import { WalletContext } from '../contexts/WalletContext';
import { Token } from '../types/Token';
import { UserWallet } from '../types/UserWallet';
import { StyledOutlinedInput } from '../components/styled/StyledOutlineInput';
import { StyledIconButton } from '../components/styled/StyledIconButton';
import TokensDialog from '../components/TokenDialog';
import BalanceBox from '../components/BalanceBox';
import { Prices } from '../types/Prices';
import { isEVMToken } from '../utils/isEVMToken';

const Swap = () => {
  const { isWalletConnected, connectedChains } = useContext(WalletContext);
  const [inputAmount, setInputAmount] = useState<number | string>('');
  const [outputAmount, setOutputAmount] = useState<number | string>('');
  const [availableTokens, setAvailableTokens] = useState<Token[]>(tokens);
  const [inputToken, setInputToken] = useState<Token>(availableTokens[0]);
  const [outputToken, setOutputToken] = useState<Token>(availableTokens[1]);
  const [prices] = useState<Prices>({
    token1: null,
    token2: null,
  });
  const [isTokensDialogOpen, setIsTokensDialogOpen] = useState(false);
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);
  const [mode, setMode] = useState<'input' | 'output'>('input');
  const [txUrl, setTxUrl] = useState('');

  const [userWallets, setUserWallets] = useState<UserWallet[]>([]);

  const [bestRoute, setBestRoute] = useState<QuoteRoute | null>(null);

  const getWalletAddressForToken = async (token: Token): Promise<string> => {
    const swapkitImport = await import('../utils/swapKit');
    if (token.chain === 'BTC') {
      return swapkitImport.client.getAddress(Chain.Bitcoin);
    }
    if (token.chain === 'ETH') {
      return swapkitImport.client.getAddress(Chain.Ethereum);
    }
    return '';
  };

  const createQuoteParams = async () => {
    const formattedSellAsset = isEVMToken(inputToken)
      ? `${inputToken.chain}.${inputToken.ticker}-${inputToken.address}`
      : `${inputToken.chain}.${inputToken.ticker}`;

    const formattedBuyAsset = isEVMToken(outputToken)
      ? `${outputToken.chain}.${outputToken.ticker}-${outputToken.address}`
      : `${outputToken.chain}.${outputToken.ticker}`;

    return {
      sellAsset: formattedSellAsset, // must be in the form 'chain.ticker' ex: 'BTC.BTC' | 'ETH.ETH'
      sellAmount: inputAmount.toString(),
      buyAsset: formattedBuyAsset,
      senderAddress: await getWalletAddressForToken(inputToken), // wallet to send sell asset
      recipientAddress: await getWalletAddressForToken(outputToken), // wallet to receive buy asset
      slippage: '3',
    };
  };

  const getBestRoute = async () => {
    const quoteParams = await createQuoteParams();
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
  }, [inputAmount, inputToken, outputToken]);

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
    setIsTokensDialogOpen(true);
    setMode('input');
  };

  const handleChangeOutputToken = () => {
    setIsTokensDialogOpen(true);
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

  const getWalletBalances = async () => {
    const swapkitImport = await import('../utils/swapKit');
    const wallets = await swapkitImport.fetchWalletBalances();
    setUserWallets(wallets as UserWallet[]);
  };

  useEffect(() => {
    if (!isWalletConnected) return;
    if (!connectedChains?.BTC) {
      const newTokens = tokens.filter((token) => token.chain !== 'BTC');
      setAvailableTokens(newTokens);
      setInputToken(newTokens[0]);
      setOutputToken(newTokens[1]);
    }
  }, [isWalletConnected, connectedChains]);

  useEffect(() => {
    if (!isWalletConnected) return;
    getWalletBalances();
  }, [isWalletConnected, inputToken, outputToken]);

  const handleSwapkitSwap = async () => {
    if (!bestRoute) return;
    setIsTransactionLoading(true);

    const quoteParams = await createQuoteParams();

    const swapkitImport = await import('../utils/swapKit');

    try {
      const txHash = await swapkitImport.client.swap({
        route: bestRoute,
        recipient: quoteParams.recipientAddress,
        feeOptionKey: FeeOption.Average,
        // FeeOption multiplies current base fee by:
        // Average => 1.2
        // Fast => 1.5
        // Fastest => 2
      });
      const inputChain = Chain[inputToken.name as keyof typeof Chain];
      const explorerUrl = swapkitImport.client.getExplorerTxUrl(
        inputChain,
        txHash
      );
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
                  <StyledIconButton
                    aria-label="input token"
                    onClick={handleChangeInputToken}
                    edge="end"
                  >
                    <Avatar src={inputToken.img} />
                  </StyledIconButton>
                </InputAdornment>
              }
              label="InputAmount"
            />
          </FormControl>
          <BalanceBox token={inputToken} userWallets={userWallets ?? null} />
          <Box component="div">
            <StyledIconButton onClick={handleTokenSwitch}>
              <ArrowDownwardIcon color="primary" />
            </StyledIconButton>
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
                  <StyledIconButton
                    aria-label="output token"
                    onClick={handleChangeOutputToken}
                    edge="end"
                  >
                    <Avatar src={outputToken.img} />
                  </StyledIconButton>
                </InputAdornment>
              }
              label="OutputAmount"
            />
          </FormControl>
          <BalanceBox token={outputToken} userWallets={userWallets ?? null} />
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
              // || !isTokenApproved
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
        availableTokens={availableTokens}
      />
    </Box>
  );
};

export default Swap;
