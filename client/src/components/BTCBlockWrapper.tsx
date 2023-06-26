import {
  Box,
  Button,
  Drawer,
  Skeleton,
  Typography,
  styled,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Block } from '../types/Block';
import { Transaction } from '../types/Transaction';

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
  // const ws = useRef<WebSocket | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  const fetchLatestBlock = async () => {
    const res = await fetch('/api/btc/latest-block');
    const data = await res.json();
    setBlocks([data]);
    setIsLoading(false);
  };

  // const handleSocketOpen = () => {
  //   if (!ws.current) return;
  //   // All new blocks
  //   const op = { op: 'blocks_sub' };
  //   ws.current.send(JSON.stringify(op));
  // };

  useEffect(() => {
    // ws.current = new WebSocket('wss://ws.blockchain.info/inv');
    // ws.current.onopen = () => handleSocketOpen();
    // ws.current.onclose = () => console.log('ws closed');

    // TODO: fix
    // ws.current.onmessage = (e) => {
    // console.log('new block', e);
    // console.log('e.data', e.data);
    // const message = JSON.parse(e.data);
    // console.log('message', message);
    // setBlocks([...blocks, message.x]);
    // };

    // const wsCurrent = ws.current;

    fetchLatestBlock();
    // return () => {
    //   wsCurrent.close();
    // };
  }, []);

  return (
    <Box mt={2}>
      {isLoading ? (
        <Skeleton variant="rounded" width={400} height={262} />
      ) : (
        <>
          <Typography>BTC Latest Block</Typography>
          {blocks.map((block: Block) => {
            return (
              <StyledBlock key={block.bits}>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  <Typography>Hash</Typography>
                  <Typography sx={{ fontSize: { xs: '8px', md: '10px' } }}>
                    {block.hash}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" width="100%">
                  <Typography>Height</Typography>
                  <Typography>{block.height}</Typography>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  width="100% "
                >
                  <Typography>Time</Typography>
                  <Typography>
                    {formatDate(new Date(block.time * 1000))}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" width="100%">
                  <Typography>Size (in bytes)</Typography>
                  <Typography>{block.size.toLocaleString()}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" width="100%">
                  <Typography>Weight</Typography>
                  <Typography>{block.weight.toLocaleString()}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" width="100%">
                  <Typography>Transactions</Typography>
                  <Button onClick={() => setSelectedBlock(block)}>
                    {block.n_tx.toLocaleString()}
                  </Button>
                </Box>
                <Typography>Merkle Root</Typography>
                {/* TODO: link to mkrl root */}
                <Typography sx={{ fontSize: { xs: '8px', md: '10px' } }}>
                  {block.mrkl_root}
                </Typography>
                <Typography>Previous Block</Typography>
                {/* TODO: fetch prev block */}
                <Typography sx={{ fontSize: { xs: '8px', md: '10px' } }}>
                  {block.prev_block}
                </Typography>
                <Drawer
                  anchor="right"
                  open={!!selectedBlock}
                  onClose={() => setSelectedBlock(null)}
                >
                  <Box bgcolor="black">
                    {selectedBlock &&
                      selectedBlock.tx.map((tx: Transaction) => {
                        return (
                          <Typography
                            fontSize="0.8rem"
                            mx={2}
                            my={1}
                            key={tx.tx_index}
                            color="primary"
                          >
                            {tx.hash}
                          </Typography>
                        );
                      })}
                  </Box>
                </Drawer>
              </StyledBlock>
            );
          })}
        </>
      )}
    </Box>
  );
};

export default BTCBlockWrapper;
