import { useEffect, useRef, useState } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import SyncDisabledIcon from '@mui/icons-material/SyncDisabled';

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
  const [transactions, setTranactions] = useState<Set<Transaction>>(new Set());
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const handleSockOpen = () => {
    if (!ws.current) return;
    // All unconfirmed txs
    const op = { op: 'unconfirmed_sub' };
    ws.current.send(JSON.stringify(op));
    setIsConnected(true);
  };

  useEffect(() => {
    ws.current = new WebSocket('wss://ws.blockchain.info/inv');
    ws.current.onopen = () => handleSockOpen();
    ws.current.onclose = () => setIsConnected(false);

    const data = new Set<Transaction>();
    const flush = () => {
      setTranactions(new Set(data));
      data.clear();
    };
    const timer = setInterval(flush, 2000);

    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      data.add(message);
    };

    const wsCurrent = ws.current;

    return () => {
      wsCurrent.close();
      clearInterval(timer);
    };
  }, []);

  return (
    <Box>
      {transactions ? (
        <Box display="flex" justifyContent="space-evenly" alignItems="center">
          <Typography># Transactions in last 2s</Typography>
          <Typography ml={5}>{transactions.size}</Typography>
          {isConnected ? (
            <LinearProgress color="success" sx={{ width: 40 }} />
          ) : (
            <SyncDisabledIcon sx={{ color: 'red' }} />
          )}
        </Box>
      ) : null}
    </Box>
  );
};

export default BTCTransactionWrapper;
