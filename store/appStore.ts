import { create } from 'zustand';

export interface Transaction {
  type: 'send' | 'receive';
  asset: string;
  amount: string;
  usd: string;
  to: string;
  time: string;
  risk: number;
  chain: string;
}

export interface TrustedDevice {
  name: string;
  os: string;
  lastSeen: string;
  trusted: boolean;
}

export interface AppState {
  unlocked: boolean;
  kyc: 'FULL_VERIFIED' | 'BASIC_VERIFIED' | 'UNVERIFIED' | 'RESTRICTED' | 'SUSPENDED';
  balanceEth: number;
  ethPrice: number;
  address: string;
  txs: Transaction[];
  biometricEnabled: boolean;
  pinEnabled: boolean;
  alertsEnabled: boolean;
  trustedDevices: TrustedDevice[];
  setUnlocked: (unlocked: boolean) => void;
  addTransaction: (tx: Transaction) => void;
  updateBalance: (balance: number) => void;
  toggleBiometric: () => void;
  togglePin: () => void;
  toggleAlerts: () => void;
}

const initialTxs: Transaction[] = [
  { type: 'send', asset: 'ETH', amount: '-0.15000000', usd: '-$524.10', to: '0xAb1C...77fF', time: '14:32', risk: 8, chain: 'ETH' },
  { type: 'receive', asset: 'ETH', amount: '+0.50000000', usd: '+$1,745.50', to: '0x9e2D...3aB0', time: '11:15', risk: 5, chain: 'ETH' },
  { type: 'send', asset: 'USDC', amount: '-250.00', usd: '-$250.00', to: '0x7f1A...c92E', time: 'YESTERDAY', risk: 12, chain: 'ETH' },
  { type: 'receive', asset: 'ETH', amount: '+0.03821000', usd: '+$133.40', to: '0x3bF2...00D1', time: 'YESTERDAY', risk: 3, chain: 'ETH' },
];

export const useAppStore = create<AppState>((set) => ({
  unlocked: false,
  kyc: 'FULL_VERIFIED',
  balanceEth: 1.38204,
  ethPrice: 3489.00,
  address: '0x4f3a8b2c9d2e1f07a6b39f04c2a18d3e10b4f3a8b',
  txs: initialTxs,
  biometricEnabled: true,
  pinEnabled: true,
  alertsEnabled: true,
  trustedDevices: [
    { name: 'iPhone 16 Pro', os: 'iOS 18.4', lastSeen: 'NOW', trusted: true },
    { name: 'MacBook Pro M4', os: 'macOS 15.3', lastSeen: '2h ago', trusted: true },
    { name: 'Unknown Device', os: 'Android 14', lastSeen: '7d ago', trusted: false },
  ],
  setUnlocked: (unlocked) => set({ unlocked }),
  addTransaction: (tx) => set((state) => ({ txs: [tx, ...state.txs] })),
  updateBalance: (balance) => set({ balanceEth: balance }),
  toggleBiometric: () => set((state) => ({ biometricEnabled: !state.biometricEnabled })),
  togglePin: () => set((state) => ({ pinEnabled: !state.pinEnabled })),
  toggleAlerts: () => set((state) => ({ alertsEnabled: !state.alertsEnabled })),
}));

// Helper functions
export const shortAddr = (a: string) => a ? `${a.slice(0, 6)}...${a.slice(-4)}` : '';
export const fmtEth = (n: number) => Number(n).toFixed(8);
export const fmtUsd = (n: number) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
