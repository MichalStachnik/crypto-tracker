import { Box } from '@mui/material';
import Explorer from '../components/Explorer';
import { BlockProvider } from '../contexts/BlockContext';

const ExplorerRoute = () => {
  return (
    <Box>
      <BlockProvider>
        <Explorer />
      </BlockProvider>
    </Box>
  );
};

export default ExplorerRoute;
