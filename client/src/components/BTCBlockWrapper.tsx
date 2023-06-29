import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  MobileStepper,
  Skeleton,
  Tooltip,
  Typography,
  styled,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Block } from '../types/Block';
import { Transaction } from '../types/Transaction';
import CloseIcon from '@mui/icons-material/Close';

const StyledBlock = styled(Box)(() => ({
  width: '320px',
  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
  background:
    'linear-gradient(0deg, rgba(0,0,0,0) 0%, #252525 30%, rgba(136,132,216,1) 99%)',
  borderRadius: '10px',
  padding: '10px',
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
  const [isLoadingPrevious, setIsLoadingPrevious] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
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

  const handleGetPreviousBlock = async (hash: string) => {
    const foundBlock = blocks.find((b) => b.hash === hash);
    if (foundBlock) return;
    setIsLoadingPrevious(true);
    const res = await fetch('/api/btc/get-block', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hash }),
    });
    const block = await res.json();
    setBlocks([block, ...blocks]);
    setIsLoadingPrevious(false);
  };

  return (
    <Box mt={2}>
      {isLoading ? (
        <Skeleton variant="rounded" width={340} height={262} />
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={40}
          >
            <Typography mr={2}>
              BTC Latest Block{blocks.length > 1 ? 's' : ''}
            </Typography>
            {isLoadingPrevious && <CircularProgress />}
          </Box>
          {blocks.length > 1 ? (
            <Box>
              <MobileStepper
                variant="dots"
                steps={blocks.length}
                position="static"
                activeStep={activeStep}
                nextButton={
                  <Button
                    onClick={() => setActiveStep(activeStep + 1)}
                    disabled={activeStep === blocks.length - 1}
                  >
                    next
                  </Button>
                }
                backButton={
                  <Button
                    onClick={() => setActiveStep(activeStep - 1)}
                    disabled={activeStep === 0}
                  >
                    back
                  </Button>
                }
                sx={{ background: 'transparent' }}
              />
            </Box>
          ) : null}
          <Box
            display="flex"
            sx={{
              overflowX: 'hidden',
            }}
          >
            <Box
              display="flex"
              gap="20px"
              sx={{
                transform: `translate(-${activeStep * 360}px)`,
                transition: '0.3s transform ease-in-out',
              }}
            >
              {blocks.map((block) => {
                return (
                  <StyledBlock key={block.hash}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                    >
                      <Typography>Hash</Typography>
                      <Typography fontSize="0.5rem">{block.hash}</Typography>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      width="100%"
                    >
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
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Tooltip title="Bitcoin's block size is capped at 1MB but can go higher due to SegWit">
                        <Typography>Size (in bytes)</Typography>
                      </Tooltip>
                      <Typography>{block.size.toLocaleString()}</Typography>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Typography>Weight</Typography>
                      <Typography>{block.weight.toLocaleString()}</Typography>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Typography>Transactions</Typography>
                      <Button
                        onClick={() => setSelectedBlock(blocks[activeStep])}
                      >
                        {block.n_tx.toLocaleString()}
                      </Button>
                    </Box>
                    <Typography>Merkle Root</Typography>
                    {/* TODO: link to mkrl root */}
                    <Typography fontSize="0.5rem">{block.mrkl_root}</Typography>
                    <Typography>Previous Block</Typography>
                    <Button
                      onClick={() => handleGetPreviousBlock(block.prev_block)}
                    >
                      <Typography fontSize="0.5rem">
                        {block.prev_block}
                      </Typography>
                    </Button>
                  </StyledBlock>
                );
              })}
            </Box>
          </Box>
        </>
      )}
      <Drawer
        anchor="right"
        open={!!selectedBlock}
        onClose={() => setSelectedBlock(null)}
      >
        <Box bgcolor="black">
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={() => setSelectedBlock(null)}>
              <CloseIcon color="primary" />
            </IconButton>
          </Box>
          {selectedBlock &&
            selectedBlock.tx.map((tx: Transaction) => {
              return (
                <Box key={tx.hash}>
                  <Typography fontSize="0.8rem" mx={2} my={1} color="primary">
                    hash: {tx.hash}
                  </Typography>
                  <Typography
                    fontSize="0.8rem"
                    mx={2}
                    my={1}
                    key={tx.tx_index}
                    color="primary"
                  >
                    size: {tx.size}
                  </Typography>
                  <Typography
                    fontSize="0.8rem"
                    mx={2}
                    my={1}
                    key={tx.tx_index}
                    color="primary"
                  >
                    weight: {tx.weight}
                  </Typography>
                </Box>
              );
            })}
        </Box>
      </Drawer>
    </Box>
  );
};

export default BTCBlockWrapper;
