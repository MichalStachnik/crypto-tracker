import { useContext, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { SortDirection } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  IconButton,
  TableSortLabel,
  Theme,
  styled,
  useTheme,
} from '@mui/material';
import { Coin } from '../types/Coin';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { UserContext } from '../contexts/UserContext';
import { CoinContext } from '../contexts/CoinContext';

const styleCell = (percentChange: number, theme: Theme) => {
  if (percentChange > 0) {
    return { color: theme.palette.success.light };
  } else if (percentChange < 0) {
    return { color: theme.palette.error.light };
  } else {
    return { color: theme.palette.primary.light };
  }
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  color: theme.palette.common.white,
  '& .MuiTableSortLabel-root:hover': {
    color: theme.palette.primary.main,
  },
  '& .MuiTableSortLabel-root.Mui-active .MuiTableSortLabel-icon': {
    color: theme.palette.primary.main,
  },
  '& .MuiTableSortLabel-root.Mui-active': {
    color: theme.palette.primary.main,
  },
}));

interface CoinTableProps {
  coins: Coin[];
  onCoinClick: (coin: Coin) => void;
}

interface Sort {
  sortKey: string;
  sortDirection: SortDirection;
}

export default function CoinTable({ coins, onCoinClick }: CoinTableProps) {
  const { user, favoriteCoins, setFavoriteCoins } = useContext(UserContext);
  const { selectedCoin, setSelectedCoin } = useContext(CoinContext);
  const [sort, setSort] = useState<Sort>({
    sortKey: '',
    sortDirection: 'asc',
  });
  const theme = useTheme();

  const toggleSort = (sortKey: string) => {
    const newDirection = sort.sortDirection === 'asc' ? 'desc' : 'asc';
    setSort({ sortKey, sortDirection: newDirection });
  };

  const handleCoinClick = (coin: Coin) => {
    setSelectedCoin(coin);
    onCoinClick(coin);
  };

  const handleHeartClick = (coin: Coin) => {
    if (favoriteCoins.includes(coin.name)) {
      handleDeleteFavoriteClick(coin);
    } else {
      handleFavoriteClick(coin);
    }
  };

  const handleFavoriteClick = async (coin: Coin) => {
    const res = await fetch('/api/add-favorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jwt: user, favorite: coin.name }),
    });

    if (res.status === 200) {
      setFavoriteCoins([...favoriteCoins, coin.name]);
    }
  };

  const handleDeleteFavoriteClick = async (coin: Coin) => {
    const res = await fetch('/api/delete-favorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jwt: user, favorite: coin.name }),
    });

    if (res.status === 200) {
      const newFavorites = favoriteCoins.filter((c) => c !== coin.name);
      setFavoriteCoins(newFavorites);
    }
  };

  if (!coins.length) return null;
  return (
    <TableContainer component={Paper} sx={{ background: 'transparent' }}>
      <Table
        sx={{ minWidth: 650, background: 'transparent' }}
        aria-label="coin table"
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: 'white' }}>Rank</TableCell>
            {user && <TableCell sx={{ color: 'white' }}>Favorite</TableCell>}
            <TableCell sx={{ color: 'white' }}>Name</TableCell>
            <TableCell sx={{ color: 'white' }}>Symbol</TableCell>
            <TableCell align="right" sx={{ color: 'white' }}>
              Price
            </TableCell>
            <StyledTableCell
              align="right"
              onClick={() => toggleSort('24hr')}
              sortDirection={
                sort.sortKey === '24hr' ? sort.sortDirection : false
              }
            >
              <TableSortLabel
                active={sort.sortKey === '24hr'}
                direction={sort.sortDirection === 'asc' ? 'asc' : 'desc'}
              >
                &Delta; 24hr
              </TableSortLabel>
            </StyledTableCell>
            <StyledTableCell
              align="right"
              onClick={() => toggleSort('7d')}
              sortDirection={sort.sortKey === '7d' ? sort.sortDirection : false}
            >
              <TableSortLabel
                active={sort.sortKey === '7d'}
                direction={sort.sortDirection === 'asc' ? 'asc' : 'desc'}
              >
                &Delta; 7d
              </TableSortLabel>
            </StyledTableCell>
            <StyledTableCell
              align="right"
              onClick={() => toggleSort('30d')}
              sortDirection={
                sort.sortKey === '30d' ? sort.sortDirection : false
              }
            >
              <TableSortLabel
                active={sort.sortKey === '30d'}
                direction={sort.sortDirection === 'asc' ? 'asc' : 'desc'}
              >
                &Delta; 30d
              </TableSortLabel>
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coins
            .sort((a, b) => {
              if (sort.sortKey === '24hr' && sort.sortDirection === 'asc') {
                return (
                  a.quote.USD.percent_change_24h -
                  b.quote.USD.percent_change_24h
                );
              } else if (
                sort.sortKey === '24hr' &&
                sort.sortDirection === 'desc'
              ) {
                return (
                  b.quote.USD.percent_change_24h -
                  a.quote.USD.percent_change_24h
                );
              } else if (
                sort.sortKey === '7d' &&
                sort.sortDirection === 'asc'
              ) {
                return (
                  a.quote.USD.percent_change_7d - b.quote.USD.percent_change_7d
                );
              } else if (
                sort.sortKey === '7d' &&
                sort.sortDirection === 'desc'
              ) {
                return (
                  b.quote.USD.percent_change_7d - a.quote.USD.percent_change_7d
                );
              } else if (
                sort.sortKey === '30d' &&
                sort.sortDirection === 'asc'
              ) {
                return (
                  a.quote.USD.percent_change_30d -
                  b.quote.USD.percent_change_30d
                );
              } else if (
                sort.sortKey === '30d' &&
                sort.sortDirection === 'desc'
              ) {
                return (
                  b.quote.USD.percent_change_30d -
                  a.quote.USD.percent_change_30d
                );
              } else {
                return 0;
              }
            })
            .map((coin) => (
              <TableRow
                key={coin.cmc_rank}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                onClick={() => handleCoinClick(coin)}
                style={{ cursor: 'pointer' }}
                hover={true}
                selected={
                  selectedCoin
                    ? coin.name === selectedCoin?.name
                    : coin.name === 'Bitcoin'
                }
              >
                <TableCell component="th" scope="row" sx={{ color: 'white' }}>
                  {coin.cmc_rank}
                </TableCell>
                {user && (
                  <TableCell sx={{ color: 'white' }}>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHeartClick(coin);
                      }}
                    >
                      <FavoriteIcon
                        color={
                          favoriteCoins.includes(coin.name) ? 'error' : 'action'
                        }
                      />
                    </IconButton>
                  </TableCell>
                )}
                <TableCell sx={{ color: 'white' }}>{coin.name}</TableCell>
                <TableCell sx={{ color: 'white' }}>{coin.symbol}</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>
                  {coin.quote.USD.price.toFixed(4)}
                </TableCell>
                <TableCell
                  align="right"
                  style={styleCell(coin.quote.USD.percent_change_24h, theme)}
                >
                  {coin.quote.USD.percent_change_24h.toFixed(2)}%
                </TableCell>
                <TableCell
                  align="right"
                  style={styleCell(coin.quote.USD.percent_change_7d, theme)}
                >
                  {coin.quote.USD.percent_change_7d.toFixed(2)}%
                </TableCell>
                <TableCell
                  align="right"
                  style={styleCell(coin.quote.USD.percent_change_30d, theme)}
                >
                  {coin.quote.USD.percent_change_30d.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
