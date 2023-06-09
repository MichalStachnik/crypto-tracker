import { Box, CircularProgress, Typography, styled } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Block } from '../types/Block';

const StyledBlock = styled(Box)(() => ({
  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
  background:
    'linear-gradient(0deg, rgba(0,0,0,0) 0%, #252525 30%, rgba(136,132,216,1) 99%)',
  borderRadius: '10px',
  padding: '10px',
  margin: '10px',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString('en-us', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

const BTCBlockWrapper = () => {
  const ws = useRef<WebSocket | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLatestBlock = async () => {
    const res = await fetch('/api/btc/latest-block');
    const data = await res.json();
    setBlocks([data]);
    setIsLoading(false);
  };

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

    // TODO: fix
    // ws.current.onmessage = (e) => {
    // console.log('new block', e);
    // console.log('e.data', e.data);
    // const message = JSON.parse(e.data);
    // console.log('message', message);
    // setBlocks([...blocks, message.x]);
    // };

    const wsCurrent = ws.current;

    fetchLatestBlock();
    return () => {
      wsCurrent.close();
    };
  }, []);

  return (
    <Box>
      <Typography>BTC Latest Block</Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {blocks.map((block: Block) => {
            return (
              <StyledBlock key={block.bits}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  <Typography>Hash</Typography>
                  <Typography fontSize="10px">{block.hash}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Height</Typography>
                  <Typography>{block.height}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Time</Typography>
                  <Typography>
                    {formatDate(new Date(block.time * 1000))}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Size</Typography>
                  <Typography>{block.size}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Weight</Typography>
                  <Typography>{block.weight}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Transactions</Typography>
                  <Typography>{block.n_tx}</Typography>
                </Box>
                <Typography>Previous Block:</Typography>
                {/* TODO: fetch prev block */}
                <Typography fontSize="10px">{block.prev_block}</Typography>
              </StyledBlock>
            );
          })}
        </>
      )}
    </Box>
  );
};

export default BTCBlockWrapper;
