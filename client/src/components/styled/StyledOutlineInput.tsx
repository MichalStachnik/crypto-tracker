import { OutlinedInput, styled } from '@mui/material';

export const StyledOutlinedInput = styled(OutlinedInput)(() => ({
  color: 'white',
  fontSize: '0.8rem',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'white',
  },
  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
    display: 'none',
  },
}));
