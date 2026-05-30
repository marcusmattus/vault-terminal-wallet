import { create } from 'zustand';
import { Chain, CHAINS } from '../constants/chains';

export interface ChainBalance {
  chainId: string;
  balance: number;
  usdValue: number;
  price: number;
}

export interface WalletAddress {
  chainId: string;
  address: string;
}

export interface Transaction {
  type: 'send' | 'receive';
  asset: string;
  amount: string;
  usd: string;
  to: string;
  from?: string;
  time: string;
  risk: number;
  chainId: string;
  txHash?: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface TrustedDevice {
  name: string;
  os: string;
  lastSeen: string;
  trusted: boolean;
}

export interface MultiChainState {
  // Authentication
  unlocked: boolean;
  kyc: 'FULL_VERIFIED' | 'BASIC_VERIFIED' | 'UNVERIFIED' | 'RESTRICTED' | 'SUSPENDED';

  // Active chain
  activeChainId: string;

  // Wallet addresses (one per chain)
  addresses: WalletAddress[];

  // Balances for all chains
  balances: ChainBalance[];

  // All transactions across all chains
  transactions: Transaction[];

  // Security settings
  biometricEnabled: boolean;
  pinEnabled: boolean;
  alertsEnabled: boolean;
  trustedDevices: TrustedDevice[];

  // Actions
  setUnlocked: (unlocked: boolean) => void;
  setActiveChain: (chainId: string) => void;
  addTransaction: (tx: Transaction) => void;
  updateBalance: (chainId: string, balance: number, price: number) => void;
  getActiveChain: () => Chain;
  getActiveAddress: () => string;
  getActiveBalance: () => ChainBalance | undefined;
  getChainTransactions: (chainId: string) => Transaction[];
  toggleBiometric: () => void;
  togglePin: () => void;
  toggleAlerts: () => void;
}

// Initial mock data
const initialAddresses: WalletAddress[] = [
  { chainId: 'ethereum', address: '0x4f3a8b2c9d2e1f07a6b39f04c2a18d3e10b4f3a8b' },
  { chainId: 'polygon', address: '0x4f3a8b2c9d2e1f07a6b39f04c2a18d3e10b4f3a8b' },
  { chainId: 'bsc', address: '0x4f3a8b2c9d2e1f07a6b39f04c2a18d3e10b4f3a8b' },
  { chainId: 'arbitrum', address: '0x4f3a8b2c9d2e1f07a6b39f04c2a18d3e10b4f3a8b' },
  { chainId: 'optimism', address: '0x4f3a8b2c9d2e1f07a6b39f04c2a18d3e10b4f3a8b' },
  { chainId: 'avalanche', address: '0x4f3a8b2c9d2e1f07a6b39f04c2a18d3e10b4f3a8b' },
  { chainId: 'solana', address: 'Hvj8E7LKCBNz3K5wNbQQwGPz3rF5V7YhKjZk9XqQ7rXC' },
  { chainId: 'bitcoin', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
  { chainId: 'sui', address: '0x5e4f5c2c8e6a3b1f7c9d8e2f4a6b8c1d3e5f7a9b2c4d6e8f1a3b5c7d9e2f4a6' },
];

const initialBalances: ChainBalance[] = [
  { chainId: 'ethereum', balance: 1.38204, price: 3489.00, usdValue: 4822.45 },
  { chainId: 'polygon', balance: 245.67, price: 0.82, usdValue: 201.45 },
  { chainId: 'bsc', balance: 0.543, price: 612.50, usdValue: 332.69 },
  { chainId: 'arbitrum', balance: 0.25, price: 3489.00, usdValue: 872.25 },
  { chainId: 'optimism', balance: 0.10, price: 3489.00, usdValue: 348.90 },
  { chainId: 'avalanche', balance: 12.5, price: 38.20, usdValue: 477.50 },
  { chainId: 'solana', balance: 8.42, price: 142.30, usdValue: 1198.17 },
  { chainId: 'bitcoin', balance: 0.0234, price: 67340.00, usdValue: 1575.76 },
  { chainId: 'sui', balance: 1245.80, price: 1.45, usdValue: 1806.41 },
];

const initialTransactions: Transaction[] = [
  { type: 'send', asset: 'ETH', amount: '-0.15000000', usd: '-$524.10', to: '0xAb1C...77fF', time: '14:32', risk: 8, chainId: 'ethereum', status: 'confirmed' },
  { type: 'receive', asset: 'ETH', amount: '+0.50000000', usd: '+$1,745.50', to: '0x9e2D...3aB0', time: '11:15', risk: 5, chainId: 'ethereum', status: 'confirmed' },
  { type: 'send', asset: 'SOL', amount: '-2.50000000', usd: '-$355.75', to: 'Hvj8E7LK...Q7rXC', time: '10:42', risk: 12, chainId: 'solana', status: 'confirmed' },
  { type: 'receive', asset: 'BTC', amount: '+0.00500000', usd: '+$336.70', to: 'bc1qxy2k...hx0wlh', time: 'YESTERDAY', risk: 3, chainId: 'bitcoin', status: 'confirmed' },
  { type: 'send', asset: 'MATIC', amount: '-50.00', usd: '-$41.00', to: '0x7f1A...c92E', time: 'YESTERDAY', risk: 7, chainId: 'polygon', status: 'confirmed' },
  { type: 'receive', asset: 'SUI', amount: '+100.00', usd: '+$145.00', to: '0x5e4f5c...4a6', time: '2 DAYS AGO', risk: 4, chainId: 'sui', status: 'confirmed' },
];

export const useMultiChainStore = create<MultiChainState>((set, get) => ({
  // Initial state
  unlocked: false,
  kyc: 'FULL_VERIFIED',
  activeChainId: 'ethereum',
  addresses: initialAddresses,
  balances: initialBalances,
  transactions: initialTransactions,
  biometricEnabled: true,
  pinEnabled: true,
  alertsEnabled: true,
  trustedDevices: [
    { name: 'iPhone 16 Pro', os: 'iOS 18.4', lastSeen: 'NOW', trusted: true },
    { name: 'MacBook Pro M4', os: 'macOS 15.3', lastSeen: '2h ago', trusted: true },
    { name: 'Unknown Device', os: 'Android 14', lastSeen: '7d ago', trusted: false },
  ],

  // Actions
  setUnlocked: (unlocked) => set({ unlocked }),

  setActiveChain: (chainId) => {
    if (CHAINS[chainId.toUpperCase()]) {
      set({ activeChainId: chainId });
    }
  },

  addTransaction: (tx) => set((state) => ({
    transactions: [tx, ...state.transactions]
  })),

  updateBalance: (chainId, balance, price) => set((state) => {
    const existingIndex = state.balances.findIndex(b => b.chainId === chainId);
    const newBalances = [...state.balances];

    if (existingIndex >= 0) {
      newBalances[existingIndex] = {
        chainId,
        balance,
        price,
        usdValue: balance * price,
      };
    } else {
      newBalances.push({
        chainId,
        balance,
        price,
        usdValue: balance * price,
      });
    }

    return { balances: newBalances };
  }),

  getActiveChain: () => {
    const state = get();
    return CHAINS[state.activeChainId.toUpperCase()] || CHAINS.ETHEREUM;
  },

  getActiveAddress: () => {
    const state = get();
    const wallet = state.addresses.find(a => a.chainId === state.activeChainId);
    return wallet?.address || '';
  },

  getActiveBalance: () => {
    const state = get();
    return state.balances.find(b => b.chainId === state.activeChainId);
  },

  getChainTransactions: (chainId) => {
    const state = get();
    return state.transactions.filter(tx => tx.chainId === chainId);
  },

  toggleBiometric: () => set((state) => ({
    biometricEnabled: !state.biometricEnabled
  })),

  togglePin: () => set((state) => ({
    pinEnabled: !state.pinEnabled
  })),

  toggleAlerts: () => set((state) => ({
    alertsEnabled: !state.alertsEnabled
  })),
}));

// Helper functions
export const shortAddr = (a: string) => a ? `${a.slice(0, 6)}...${a.slice(-4)}` : '';
export const fmtBalance = (n: number, decimals: number = 8) => Number(n).toFixed(Math.min(decimals, 8));
export const fmtUsd = (n: number) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Calculate total portfolio value
export const getTotalPortfolioValue = (balances: ChainBalance[]): number => {
  return balances.reduce((total, b) => total + b.usdValue, 0);
};
