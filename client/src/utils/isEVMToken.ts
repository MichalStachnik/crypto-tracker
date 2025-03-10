import { Token } from '../types/Token';

export const isEVMToken = (token: Token) => {
  if (token.chain === 'ETH' && token.address) {
    return true;
  } else {
    return false;
  }
};
