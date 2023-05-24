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
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
}));

interface CoinTableProps {
  coins: Coin[];
  onCoinClick: (coin: Coin) => void;
}

export default function CoinTable({ coins, onCoinClick }: CoinTableProps) {
  const [sort, setSort] = useState<string>('');

  const toggleSort = () => {
    if (sort === 'desc') setSort('asc');
    else setSort('desc');
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
            <StyledTableCell align="right" onClick={toggleSort}>
              Percent Change 24Hr
              {sort === 'asc' && <ArrowUp />}
              {sort == 'desc' && <ArrowDown />}
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coins
            .sort((a, b) => {
              if (sort === 'asc') {
                return (
                  a.quote.USD.percent_change_24h -
                  b.quote.USD.percent_change_24h
                );
              } else if (sort === 'desc') {
                return (
                  b.quote.USD.percent_change_24h -
                  a.quote.USD.percent_change_24h
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
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
