import { IconButton, styled } from '@mui/material';

export const StyledIconButton = styled(IconButton)(() => ({
  '&:focus': {
    outline: 'none',
  },
}));
