import { Box, CircularProgress, Typography, styled } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

interface Block {
  bits: number;
  block_index: number;
  fee: number;
  hash: string;
  height: number;
  main_chain: boolean;
  mrkl_root: string;
  n_tx: number;
  next_block: Block[];
  none: number;
  prev_block: string;
  size: number;
  time: number;
  tx: any[];
  ver: number;
  weight: number;
}

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
                <Typography>Hash: </Typography>
                <Typography fontSize="10px">{block.hash}</Typography>
                <Typography>Height: {block.height}</Typography>
                <Typography>
                  Time: {formatDate(new Date(block.time * 1000))}
                </Typography>
                <Typography>Size: {block.size}</Typography>
                <Typography>Weight: {block.weight}</Typography>
                <Typography>Transactions: {block.n_tx}</Typography>
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
