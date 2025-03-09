import { useContext, useState } from 'react';
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
import { Block } from '../types/Block';
import { Transaction } from '../types/Transaction';
import CloseIcon from '@mui/icons-material/Close';
import { BlockContext } from '../contexts/BlockContext';

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
  const { blocks, isLoading, getBlockByHash } = useContext(BlockContext);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  return (
    <Box mt={2} component="div">
      {!blocks.length ? (
        <Skeleton variant="rounded" width={340} height={262} />
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={40}
            component="div"
          >
            <Typography mr={2} color="primary">
              BTC Latest Blocks
            </Typography>
            {isLoading && <CircularProgress />}
          </Box>
          <Box component="div">
            <MobileStepper
              variant="dots"
              steps={blocks.length}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button
                  onClick={() => setActiveStep(activeStep + 1)}
                  disabled={activeStep === blocks.length - 1 || isLoading}
                  sx={{ textTransform: 'capitalize' }}
                  variant="outlined"
                >
                  next block
                </Button>
              }
              backButton={
                activeStep === 0 ? (
                  <Button
                    onClick={() =>
                      getBlockByHash(blocks[activeStep].prev_block)
                    }
                    sx={{ textTransform: 'capitalize' }}
                    variant="outlined"
                    disabled={isLoading}
                  >
                    previous block
                  </Button>
                ) : (
                  <Button
                    onClick={() => setActiveStep(activeStep - 1)}
                    sx={{ textTransform: 'capitalize' }}
                    variant="outlined"
                    disabled={isLoading}
                  >
                    previous block
                  </Button>
                )
              }
              sx={{ background: 'transparent' }}
            />
          </Box>
          <Box
            display="flex"
            sx={{
              overflowX: 'hidden',
            }}
            component="div"
          >
            <Box
              display="flex"
              gap="20px"
              sx={{
                transform: `translate(-${activeStep * 360}px)`,
                transition: '0.3s transform ease-in-out',
              }}
              component="div"
            >
              {blocks.map((block) => {
                return (
                  <StyledBlock key={block.hash}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      width="100%"
                      component="div"
                    >
                      <Typography>Height</Typography>
                      <Typography>{block.height}</Typography>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      width="100%"
                      component="div"
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
                      component="div"
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
                      component="div"
                    >
                      <Typography>Weight</Typography>
                      <Typography>{block.weight.toLocaleString()}</Typography>
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      width="100%"
                      component="div"
                    >
                      <Typography>Transactions</Typography>
                      <Button
                        onClick={() => setSelectedBlock(blocks[activeStep])}
                      >
                        {block.n_tx.toLocaleString()}
                      </Button>
                    </Box>
                    <Typography>Hash</Typography>
                    <Typography fontSize="0.5rem" color="primary.main">
                      {block.hash}
                    </Typography>
                    <Typography>Merkle Root</Typography>
                    {/* TODO: link to mkrl root */}
                    <Typography fontSize="0.5rem" color="primary.main">
                      {block.mrkl_root}
                    </Typography>
                    <Typography>Previous Block</Typography>
                    <Typography fontSize="0.5rem" color="primary.main">
                      {block.prev_block}
                    </Typography>
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
        <Box bgcolor="black" component="div">
          <Box display="flex" justifyContent="flex-end" component="div">
            <IconButton onClick={() => setSelectedBlock(null)}>
              <CloseIcon color="primary" />
            </IconButton>
          </Box>
          {selectedBlock &&
            selectedBlock.tx.map((tx: Transaction) => {
              return (
                <Box key={tx.hash} component="div">
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
