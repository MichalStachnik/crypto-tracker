import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';

const BTCBlockWrapper = () => {
  const ws = useRef<WebSocket | null>(null);

  const handleSockOpen = () => {
    if (!ws.current) return;
    // All new blocks
    const op = { op: 'blocks_sub' };
    ws.current.send(JSON.stringify(op));
  };

  useEffect(() => {
    ws.current = new WebSocket('wss://ws.blockchain.info/inv');
    ws.current.onopen = () => handleSockOpen();
    ws.current.onclose = () => console.log('ws closed');
    // All unconfirmed txs
    // const op = { op: 'unconfirmed_sub' };
    // All new blocks

    ws.current.onmessage = (e) => {
      console.log('e', e);
      console.log('e', e.data);
      // const message = JSON.parse(e.data);
      // console.log(message);
    };

    const wsCurrent = ws.current;

    return () => {
      wsCurrent.close();
    };
  }, []);

  return <Box>btc block wrapper</Box>;
};

export default BTCBlockWrapper;
