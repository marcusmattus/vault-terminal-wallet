import { Colors } from './colors';

export type ChainType = 'EVM' | 'SOLANA' | 'BITCOIN' | 'SUI';

export interface Chain {
  id: string;
  name: string;
  symbol: string;
  type: ChainType;
  icon: string;
  color: string;
  decimals: number;
  rpcUrl: string;
  explorerUrl: string;
  chainId?: number; // For EVM chains
}

export const CHAINS: Record<string, Chain> = {
  // EVM Chains
  ETHEREUM: {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    type: 'EVM',
    icon: 'Ξ',
    color: Colors.greenPrimary,
    decimals: 18,
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
    explorerUrl: 'https://etherscan.io',
    chainId: 1,
  },
  POLYGON: {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    type: 'EVM',
    icon: '⬡',
    color: '#8247E5',
    decimals: 18,
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    chainId: 137,
  },
  BSC: {
    id: 'bsc',
    name: 'BNB Chain',
    symbol: 'BNB',
    type: 'EVM',
    icon: '◆',
    color: '#F3BA2F',
    decimals: 18,
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
    chainId: 56,
  },
  ARBITRUM: {
    id: 'arbitrum',
    name: 'Arbitrum One',
    symbol: 'ETH',
    type: 'EVM',
    icon: '▲',
    color: '#28A0F0',
    decimals: 18,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    chainId: 42161,
  },
  OPTIMISM: {
    id: 'optimism',
    name: 'Optimism',
    symbol: 'ETH',
    type: 'EVM',
    icon: '○',
    color: '#FF0420',
    decimals: 18,
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
    chainId: 10,
  },
  AVALANCHE: {
    id: 'avalanche',
    name: 'Avalanche C-Chain',
    symbol: 'AVAX',
    type: 'EVM',
    icon: '▲',
    color: '#E84142',
    decimals: 18,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io',
    chainId: 43114,
  },

  // Solana
  SOLANA: {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    type: 'SOLANA',
    icon: '◎',
    color: '#14F195',
    decimals: 9,
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://explorer.solana.com',
  },

  // Bitcoin
  BITCOIN: {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    type: 'BITCOIN',
    icon: '₿',
    color: '#F7931A',
    decimals: 8,
    rpcUrl: 'https://blockchain.info',
    explorerUrl: 'https://blockchain.com/explorer',
  },

  // Sui
  SUI: {
    id: 'sui',
    name: 'Sui Network',
    symbol: 'SUI',
    type: 'SUI',
    icon: '水',
    color: '#4DA2FF',
    decimals: 9,
    rpcUrl: 'https://fullnode.mainnet.sui.io',
    explorerUrl: 'https://explorer.sui.io',
  },
};

export const CHAIN_GROUPS = {
  EVM: ['ETHEREUM', 'POLYGON', 'BSC', 'ARBITRUM', 'OPTIMISM', 'AVALANCHE'],
  NON_EVM: ['SOLANA', 'BITCOIN', 'SUI'],
  ALL: Object.keys(CHAINS),
};

// Token standards per chain
export const TOKEN_STANDARDS = {
  EVM: ['ERC20', 'ERC721', 'ERC1155'],
  SOLANA: ['SPL', 'SPL-NFT'],
  BITCOIN: ['BTC', 'BRC20', 'ORDINALS'],
  SUI: ['SUI-COIN', 'SUI-NFT'],
};
