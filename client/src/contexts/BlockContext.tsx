import { createContext, Dispatch, ReactNode, useEffect, useState } from 'react';
import { Block } from '../types/Block';

interface BlockContextInterface {
  blocks: Block[];
  setBlocks: Dispatch<React.SetStateAction<Block[]>>;
  isLoading: boolean;
  getBlockByHash: (hash: string) => Promise<Block | undefined>;
}

const initialState: BlockContextInterface = {
  blocks: [],
  setBlocks: () => null,
  isLoading: true,
  getBlockByHash: async () => undefined,
};

export const BlockContext = createContext<BlockContextInterface>(initialState);

interface BlockProviderProps {
  /**
   * The children components of the provider
   */
  children: ReactNode;
}

export const BlockProvider = ({ children }: BlockProviderProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    fetchFirst2Blocks();
  }, []);

  const fetchFirst2Blocks = async () => {
    const latestRes = await fetch('/api/btc/latest-block');
    const latestBlock: Block = await latestRes.json();
    setBlocks([latestBlock]);

    const blockRes = await fetch('/api/btc/get-block', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hash: latestBlock.prev_block }),
    });

    const block: Block = await blockRes.json();
    setBlocks([block, latestBlock]);

    setIsLoading(false);
  };

  const getBlockByHash = async (hash: string) => {
    const foundBlock = blocks.find((b) => b.hash === hash);
    if (foundBlock) return;
    setIsLoading(true);
    const res = await fetch('/api/btc/get-block', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hash }),
    });
    const block: Block = await res.json();
    setBlocks([block, ...blocks]);
    setIsLoading(false);
    return block;
  };

  return (
    <BlockContext.Provider
      value={{
        blocks,
        setBlocks,
        isLoading,
        getBlockByHash,
      }}
    >
      {children}
    </BlockContext.Provider>
  );
};
