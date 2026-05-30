import { ChainType } from '../constants/chains';

// Address validation patterns
const ADDRESS_PATTERNS = {
  EVM: /^0x[a-fA-F0-9]{40}$/,
  SOLANA: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  BITCOIN: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/,
  SUI: /^0x[a-fA-F0-9]{64}$/,
};

// ENS/Domain patterns
const DOMAIN_PATTERNS = {
  EVM: /^[a-z0-9-]+\.eth$/,
  SOLANA: /^[a-z0-9-]+\.sol$/,
  BITCOIN: null,
  SUI: /^[a-z0-9-]+\.sui$/,
};

export interface AddressValidation {
  isValid: boolean;
  isDomain: boolean;
  chainType?: ChainType;
  formatted?: string;
  error?: string;
}

/**
 * Validate blockchain address for any supported chain
 */
export const validateAddress = (address: string, chainType: ChainType): AddressValidation => {
  if (!address) {
    return { isValid: false, isDomain: false, error: 'Address is required' };
  }

  const trimmed = address.trim();

  // Check for domain names (ENS, SNS, etc.)
  const domainPattern = DOMAIN_PATTERNS[chainType];
  if (domainPattern && domainPattern.test(trimmed)) {
    return {
      isValid: true,
      isDomain: true,
      chainType,
      formatted: trimmed.toLowerCase(),
    };
  }

  // Validate address format
  const pattern = ADDRESS_PATTERNS[chainType];
  const isValid = pattern.test(trimmed);

  if (!isValid) {
    return {
      isValid: false,
      isDomain: false,
      error: `Invalid ${chainType} address format`,
    };
  }

  // Format based on chain type
  let formatted = trimmed;
  if (chainType === 'EVM') {
    formatted = trimmed.toLowerCase();
  }

  return {
    isValid: true,
    isDomain: false,
    chainType,
    formatted,
  };
};

/**
 * Shorten address for display
 */
export const shortenAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

/**
 * Generate deterministic risk score based on address analysis
 */
export interface RiskAnalysis {
  score: number; // 0-100
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  factors: RiskFactor[];
  recommendations: string[];
}

export interface RiskFactor {
  category: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  points: number;
}

export const analyzeAddressRisk = async (
  address: string,
  chainType: ChainType,
  amount?: number
): Promise<RiskAnalysis> => {
  // Simulate async blockchain analysis
  await new Promise(resolve => setTimeout(resolve, 100));

  const factors: RiskFactor[] = [];
  let totalScore = 0;

  // Check 1: Address age (new addresses are riskier)
  const addressHash = hashString(address);
  const isNewAddress = addressHash % 10 < 3;
  if (isNewAddress) {
    factors.push({
      category: 'Address Age',
      severity: 'medium',
      description: 'Address appears to be newly created',
      points: 15,
    });
    totalScore += 15;
  }

  // Check 2: Blacklist screening
  const isBlacklisted = addressHash % 100 < 2; // 2% chance
  if (isBlacklisted) {
    factors.push({
      category: 'Blacklist',
      severity: 'high',
      description: 'Address found in sanction lists',
      points: 40,
    });
    totalScore += 40;
  }

  // Check 3: Transaction pattern analysis
  const hasUnusualPattern = addressHash % 20 < 4;
  if (hasUnusualPattern) {
    factors.push({
      category: 'Transaction Pattern',
      severity: 'medium',
      description: 'Unusual transaction patterns detected',
      points: 20,
    });
    totalScore += 20;
  }

  // Check 4: Amount-based risk (large amounts are riskier)
  if (amount && amount > 10) {
    factors.push({
      category: 'High Value Transfer',
      severity: 'low',
      description: `Large transfer amount: ${amount} ${chainType === 'EVM' ? 'ETH' : 'tokens'}`,
      points: 10,
    });
    totalScore += 10;
  }

  // Check 5: Chain-specific risks
  if (chainType === 'BITCOIN' && addressHash % 15 < 2) {
    factors.push({
      category: 'Mixing Service',
      severity: 'high',
      description: 'Address potentially linked to mixing services',
      points: 35,
    });
    totalScore += 35;
  }

  if (chainType === 'SOLANA' && addressHash % 12 < 2) {
    factors.push({
      category: 'MEV Activity',
      severity: 'medium',
      description: 'Address shows MEV bot activity',
      points: 15,
    });
    totalScore += 15;
  }

  // Check 6: Smart contract interaction (for EVM)
  if (chainType === 'EVM' && addressHash % 8 < 2) {
    factors.push({
      category: 'Smart Contract',
      severity: 'low',
      description: 'Destination is a smart contract',
      points: 8,
    });
    totalScore += 8;
  }

  // Determine risk level
  const level = totalScore < 30 ? 'LOW' : totalScore < 70 ? 'MEDIUM' : 'HIGH';

  // Generate recommendations
  const recommendations: string[] = [];
  if (totalScore === 0) {
    recommendations.push('Address passed all security checks');
  }
  if (totalScore > 0 && totalScore < 30) {
    recommendations.push('Proceed with standard precautions');
  }
  if (totalScore >= 30 && totalScore < 70) {
    recommendations.push('Review transaction details carefully');
    recommendations.push('Consider using lower amount for first transfer');
  }
  if (totalScore >= 70) {
    recommendations.push('HIGH RISK: Consider alternative recipient');
    recommendations.push('Contact support if you believe this is an error');
  }
  if (isBlacklisted) {
    recommendations.push('CRITICAL: This address is sanctioned');
  }

  return {
    score: Math.min(totalScore, 100),
    level,
    factors,
    recommendations,
  };
};

/**
 * Simple string hash function
 */
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * Estimate gas/fees for different chains
 */
export interface FeeEstimate {
  networkFee: string;
  networkFeeUsd: string;
  gasPrice?: string;
  priorityFee?: string;
  estimatedTime: string;
}

export const estimateFees = async (
  chainType: ChainType,
  amount: number
): Promise<FeeEstimate> => {
  // Simulate async fee estimation
  await new Promise(resolve => setTimeout(resolve, 50));

  switch (chainType) {
    case 'EVM':
      return {
        networkFee: '0.00142 ETH',
        networkFeeUsd: '$4.96',
        gasPrice: '18 GWEI',
        priorityFee: '1.5 GWEI',
        estimatedTime: '~15 seconds',
      };

    case 'SOLANA':
      return {
        networkFee: '0.000005 SOL',
        networkFeeUsd: '$0.0002',
        estimatedTime: '~400ms',
      };

    case 'BITCOIN':
      return {
        networkFee: '0.00002 BTC',
        networkFeeUsd: '$1.20',
        gasPrice: '12 sat/vB',
        estimatedTime: '~10 minutes',
      };

    case 'SUI':
      return {
        networkFee: '0.001 SUI',
        networkFeeUsd: '$0.002',
        estimatedTime: '~2 seconds',
      };

    default:
      return {
        networkFee: '0',
        networkFeeUsd: '$0',
        estimatedTime: 'Unknown',
      };
  }
};

/**
 * Simulate transaction signing and broadcasting
 */
export interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
  explorerUrl?: string;
}

export const sendTransaction = async (
  fromAddress: string,
  toAddress: string,
  amount: string,
  chainType: ChainType,
  chainId: string
): Promise<TransactionResult> => {
  // Simulate transaction processing
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Generate mock transaction hash
  const txHash = generateTxHash(chainType);

  return {
    success: true,
    txHash,
    explorerUrl: getExplorerUrl(chainId, txHash),
  };
};

/**
 * Generate mock transaction hash based on chain type
 */
const generateTxHash = (chainType: ChainType): string => {
  const timestamp = Date.now().toString(16);

  switch (chainType) {
    case 'EVM':
      return `0x${timestamp}${'a'.repeat(64 - timestamp.length - 2)}`;

    case 'SOLANA':
      const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      return Array.from({ length: 88 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

    case 'BITCOIN':
      return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    case 'SUI':
      return `0x${timestamp}${'b'.repeat(64 - timestamp.length - 2)}`;

    default:
      return timestamp;
  }
};

/**
 * Get explorer URL for transaction
 */
const getExplorerUrl = (chainId: string, txHash: string): string => {
  const explorers: Record<string, string> = {
    ethereum: 'https://etherscan.io/tx/',
    polygon: 'https://polygonscan.com/tx/',
    bsc: 'https://bscscan.com/tx/',
    arbitrum: 'https://arbiscan.io/tx/',
    optimism: 'https://optimistic.etherscan.io/tx/',
    avalanche: 'https://snowtrace.io/tx/',
    solana: 'https://explorer.solana.com/tx/',
    bitcoin: 'https://blockchain.com/btc/tx/',
    sui: 'https://explorer.sui.io/txblock/',
  };

  return (explorers[chainId] || '') + txHash;
};

/**
 * Format balance based on chain decimals
 */
export const formatBalance = (balance: number, decimals: number): string => {
  return balance.toFixed(Math.min(decimals, 8));
};

/**
 * Parse amount string to number
 */
export const parseAmount = (amountStr: string, decimals: number): number => {
  const parsed = parseFloat(amountStr);
  if (isNaN(parsed)) return 0;
  return parsed;
};
