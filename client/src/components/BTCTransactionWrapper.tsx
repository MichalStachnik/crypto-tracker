import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import TransactionChart from './TransactionChart';
import AverageTransactionChart from './AverageTransactionChart';

interface Transaction {
  value: {
    op: string;
    x: {
      hash: string;
      inputs: any[];
      lock_time: number;
      out: any[];
      relayed_by: string;
      size: number;
      time: number;
      tx_index: number;
      ver: number;
      vin_sz: number;
      vout_sz: number;
    };
  };
}

const BTCTransactionWrapper = () => {
  const ws = useRef<WebSocket | null>(null);
  const [transactions, setTransactions] = useState<Set<Transaction>>(new Set());
  const [sizes, setSizes] = useState<number[]>([]);
  const [, setIsConnected] = useState<boolean>(false);

  const handleSocketOpen = () => {
    if (!ws.current || ws.current.readyState !== 1) return;
    // All unconfirmed txs
    const op = { op: 'unconfirmed_sub' };
    ws.current.send(JSON.stringify(op));
    setIsConnected(true);
  };

  useEffect(() => {
    ws.current = new WebSocket('wss://ws.blockchain.info/inv');
    ws.current.onopen = () => handleSocketOpen();
    ws.current.onclose = () => setIsConnected(false);
    ws.current.onerror = (err) => console.error('websocket error', err);

    const data = new Set<Transaction>();
    const graphData: number[] = [];
    const flush = () => {
      setTransactions(new Set(data));
      graphData.push(data.size);
      setSizes([...graphData]);
      data.clear();
    };
    const timer = setInterval(flush, 2000);

    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      data.add(message);
    };

    const wsCurrent = ws.current;

    return () => {
      if (wsCurrent.readyState === 1) {
        wsCurrent.close();
        clearInterval(timer);
      }
    };
  }, []);

  // const handleRetryConnect = () => {
  //   handleSocketOpen();
  // };

  const average = useMemo(() => {
    if (!sizes.length) return 0;
    let sum = 0;
    sizes.forEach((size) => (sum += size));
    return sum / sizes.length;
  }, [sizes]);
  return (
    <Box>
      {transactions ? (
        <Box display="flex" flexDirection="column">
          {/* <Box display="flex" justifyContent="flex-end">
            {isConnected ? (
              <LinearProgress color="success" sx={{ width: 40 }} />
            ) : (
              <IconButton onClick={handleRetryConnect}>
                <SyncDisabledIcon sx={{ color: 'red' }} />
              </IconButton>
            )}
          </Box> */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Typography># of transactions broadcast in last 2s</Typography>
            <Typography ml={5} color="#fa9e32">
              {transactions.size}
            </Typography>
          </Box>
          <Box>
            <TransactionChart sizes={sizes} />
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography align="left">average # of transactions</Typography>
            <Typography ml={5} color="#fa9e32">
              {Math.floor(average)}
            </Typography>
          </Box>
          <Box>
            <AverageTransactionChart sizes={sizes} />
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};

export default BTCTransactionWrapper;
