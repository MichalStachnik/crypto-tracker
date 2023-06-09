import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const BTCMempoolWrapper = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mempoolLength, setMempoolLength] = useState<number>(0);
  useEffect(() => {
    const fetchMempool = () => {
      setIsLoading(true);
      fetch('/api/mempool')
        .then((res) => res.json())
        .then((res) => {
          setMempoolLength(Object.keys(res.result).length);
        })
        .catch((err) => console.error('Error', err))
        .finally(() => setIsLoading(false));
    };
    fetchMempool();
  }, []);

  return (
    <Box>
      {isLoading ? (
        <Box display="flex" justifyContent="space-between">
          <Typography>Loading mempool...</Typography>
          <CircularProgress />
        </Box>
      ) : (
        <Box display="flex" justifyContent="space-between">
          <Typography>current mempool size</Typography>
          <Typography color="#fa9e32">{mempoolLength}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default BTCMempoolWrapper;
