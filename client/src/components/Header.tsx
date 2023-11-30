import {
  ChangeEvent,
  useContext,
  useMemo,
  SyntheticEvent,
  useState,
  useEffect,
} from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  TextField,
  Theme,
  useTheme,
} from '@mui/material';

import { Coin } from '../types/Coin';
import { CoinContext } from '../contexts/CoinContext';
import { useNavigate } from 'react-router-dom';

const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

const styleCell = (percentChange: number, theme: Theme) => {
  if (percentChange > 0) {
    return { color: theme.palette.success.light };
  } else if (percentChange < 0) {
    return { color: theme.palette.error.light };
  } else {
    return { color: theme.palette.primary.light };
  }
};

export const StyledLogo = styled(Typography)(({ theme }) => ({
  backgroundImage:
    'linear-gradient(90deg, rgb(255,255,255) 0%, rgba(136,132,216,1) 99%)',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    padding: 0,
  },
  '& .MuiInputBase-input.MuiAutocomplete-input': {
    color: 'initial',
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.down('md')]: {
      width: 30,
      color: 'transparent',
      padding: '8px 12px',
      '::placeholder': {
        display: 'none',
      },
      ':focus': {
        width: 100,
        color: 'initial',
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      },
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

interface GlobalData {
  [key: string]: any;
  error?: string;
}

export default function Header() {
  const { coins, setSelectedCoin, fetchLiveCoinWatch } =
    useContext(CoinContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const [globalData, setGlobalData] = useState<GlobalData>({});
  const [searchText, setSearchText] = useState<string>('');

  const fetchGlobal = () => {
    fetch('/api/global')
      .then((res) => res.json())
      .then((res) => setGlobalData(res))
      .catch((err) => console.error('Error', err));
  };

  useEffect(() => {
    fetchGlobal();
  }, []);

  const handleSearch = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearchText(event.target.value);
  };

  const coinNameSuggestions = useMemo(() => {
    if (!searchText) return [];
    else return coins.map((coin: Coin) => coin.name);
  }, [searchText, coins]);

  const handleAutoCompleteChange = (
    _event: SyntheticEvent<Element, Event>,
    value: unknown
  ) => {
    if (value === null) {
      setSelectedCoin(null);
      setSearchText('');
      return;
    }
    const selectedCoin = coins.find((c: Coin) => c.name === value);
    if (!selectedCoin) return;
    setSelectedCoin(selectedCoin);
    fetchLiveCoinWatch(selectedCoin.symbol, '24hr');
  };

  return (
    <Box flexGrow={1} component="div">
      <AppBar
        position="static"
        sx={{
          background: 'transparent',
        }}
        elevation={0}
      >
        <Toolbar>
          <StyledLogo
            variant="h6"
            noWrap
            fontWeight="bold"
            onClick={() => navigate('/')}
            sx={{ cursor: 'pointer' }}
          >
            wm
          </StyledLogo>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <Autocomplete
              freeSolo
              options={coinNameSuggestions}
              noOptionsText="Search..."
              onChange={handleAutoCompleteChange}
              renderInput={(params: AutocompleteRenderInputParams) => (
                <StyledTextField
                  {...params}
                  placeholder="Search…"
                  value={searchText}
                  onChange={handleSearch}
                />
              )}
            />
          </Search>
          <Box flex={1} component="div">
            {Object.keys(globalData).length && !globalData['error'] ? (
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                gap={1}
                component="div"
              >
                <Box
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  p={1}
                  height="45px"
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                  }}
                  component="div"
                >
                  <Typography fontSize="0.8rem">Bitcoin dominance</Typography>
                  <Typography>
                    {globalData.bitcoin_dominance_percentage.toFixed(2)}%
                  </Typography>
                </Box>

                <Box
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  p={1}
                  height="45px"
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                  }}
                  component="div"
                >
                  <Typography fontSize="0.8rem">Market cap</Typography>
                  <Typography fontSize="0.8rem">
                    {USDollar.format(globalData.market_cap_usd)}
                  </Typography>
                </Box>
                <Box
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  p={1}
                  height="45px"
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                  }}
                  component="div"
                >
                  <Typography fontSize="0.8rem">
                    Market cap &Delta; 24hr
                  </Typography>
                  <Typography
                    style={styleCell(globalData.market_cap_change_24h, theme)}
                    fontWeight="bold"
                  >
                    {globalData.market_cap_change_24h.toFixed(2)}%
                  </Typography>
                </Box>
              </Box>
            ) : null}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
