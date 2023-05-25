import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ArrowDown, ArrowUp } from 'react-feather';
import { styled } from '@mui/material';
import { Coin } from '../types/Coin';

const styleCell = (percentChange: number) => {
  if (percentChange > 0) {
    return { color: 'green' };
  } else if (percentChange < 0) {
    return { color: 'red' };
  } else {
    return { color: 'black' };
  }
};

const StyledTableCell = styled(TableCell)(() => ({
  cursor: 'pointer',
}));

interface CoinTableProps {
  coins: Coin[];
  onCoinClick: (coin: Coin) => void;
}

interface Sort {
  sortKey: string;
  sortDirection: string;
}

export default function CoinTable({ coins, onCoinClick }: CoinTableProps) {
  const [sort, setSort] = useState<Sort>({
    sortKey: '',
    sortDirection: 'asc',
  });

  const toggleSort = (sortKey: string) => {
    const newDirection = sort.sortDirection === 'asc' ? 'desc' : 'asc';
    setSort({ sortKey, sortDirection: newDirection });
  };

  if (!coins.length) return null;
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell align="right">Price</TableCell>
            <StyledTableCell align="right" onClick={() => toggleSort('24hr')}>
              % Change 24Hr
              {sort.sortKey === '24hr' && sort.sortDirection === 'asc' && (
                <ArrowUp />
              )}
              {sort.sortKey === '24hr' && sort.sortDirection == 'desc' && (
                <ArrowDown />
              )}
            </StyledTableCell>
            <StyledTableCell align="right" onClick={() => toggleSort('7d')}>
              % Change 7d
              {sort.sortKey === '7d' && sort.sortDirection === 'asc' && (
                <ArrowUp />
              )}
              {sort.sortKey === '7d' && sort.sortDirection == 'desc' && (
                <ArrowDown />
              )}
            </StyledTableCell>
            <StyledTableCell align="right" onClick={() => toggleSort('30d')}>
              % Change 30d
              {sort.sortKey === '30d' && sort.sortDirection === 'asc' && (
                <ArrowUp />
              )}
              {sort.sortKey === '30d' && sort.sortDirection == 'desc' && (
                <ArrowDown />
              )}
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
                onClick={() => onCoinClick(coin)}
                style={{ cursor: 'pointer' }}
              >
                <TableCell component="th" scope="row">
                  {coin.cmc_rank}
                </TableCell>
                <TableCell>{coin.name}</TableCell>
                <TableCell>{coin.symbol}</TableCell>
                <TableCell align="right">
                  {coin.quote.USD.price.toFixed(4)}
                </TableCell>
                <TableCell
                  align="right"
                  style={styleCell(coin.quote.USD.percent_change_24h)}
                >
                  {coin.quote.USD.percent_change_24h.toFixed(2)}%
                </TableCell>
                <TableCell
                  align="right"
                  style={styleCell(coin.quote.USD.percent_change_7d)}
                >
                  {coin.quote.USD.percent_change_7d.toFixed(2)}%
                </TableCell>
                <TableCell
                  align="right"
                  style={styleCell(coin.quote.USD.percent_change_30d)}
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
