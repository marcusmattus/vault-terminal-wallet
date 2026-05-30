# Blockchain Integration Documentation

## Overview

Vault Terminal Wallet supports multiple blockchain networks with comprehensive security scanning and risk analysis. The multi-chain architecture is designed to be extensible, allowing easy addition of new blockchain networks.

## Supported Blockchains

### EVM-Compatible Chains
- **Ethereum** (ETH) - Mainnet, Chain ID: 1
- **Polygon** (MATIC) - PoS Chain, Chain ID: 137
- **BNB Chain** (BNB) - Formerly BSC, Chain ID: 56
- **Arbitrum One** (ETH) - L2 Rollup, Chain ID: 42161
- **Optimism** (ETH) - L2 Rollup, Chain ID: 10
- **Avalanche C-Chain** (AVAX) - EVM Compatible, Chain ID: 43114

### Non-EVM Chains
- **Solana** (SOL) - High-performance blockchain
- **Bitcoin** (BTC) - Original cryptocurrency
- **Sui Network** (SUI) - Next-gen smart contract platform

## Architecture

### Chain Configuration (`constants/chains.ts`)

Each blockchain is defined with the following properties:

```typescript
interface Chain {
  id: string;           // Unique identifier (e.g., 'ethereum')
  name: string;         // Display name (e.g., 'Ethereum')
  symbol: string;       // Token symbol (e.g., 'ETH')
  type: ChainType;      // 'EVM' | 'SOLANA' | 'BITCOIN' | 'SUI'
  icon: string;         // Unicode icon (e.g., 'Ξ')
  color: string;        // Brand color (hex)
  decimals: number;     // Token decimals (e.g., 18)
  rpcUrl: string;       // RPC endpoint
  explorerUrl: string;  // Block explorer URL
  chainId?: number;     // EVM chain ID (for EVM chains only)
}
```

### State Management (`store/multiChainStore.ts`)

The multi-chain wallet state manages:

- **Wallet Addresses**: One address per blockchain
- **Balances**: Real-time balance tracking for each chain
- **Transactions**: Unified transaction history across all chains
- **Active Chain**: Currently selected blockchain network

Key features:
- Zustand-based state management
- Type-safe chain switching
- Transaction filtering by chain
- Portfolio value aggregation

## Address Validation

### Validation Patterns

Each blockchain type has specific address format requirements:

```typescript
const ADDRESS_PATTERNS = {
  EVM: /^0x[a-fA-F0-9]{40}$/,                    // 0x + 40 hex chars
  SOLANA: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,       // Base58, 32-44 chars
  BITCOIN: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/,  // SegWit or Legacy
  SUI: /^0x[a-fA-F0-9]{64}$/,                    // 0x + 64 hex chars
};
```

### Domain Name Support

The wallet supports blockchain domain names:

- **EVM**: ENS domains (.eth)
- **Solana**: SNS domains (.sol)
- **Bitcoin**: Not supported
- **Sui**: SuiNS domains (.sui)

### Usage

```typescript
import { validateAddress } from '../utils/blockchain';

const validation = validateAddress(address, chainType);

if (!validation.isValid) {
  console.error(validation.error);
}
```

## Security Scanning

### Risk Analysis System

The security scanner performs comprehensive risk assessment:

#### Risk Factors Analyzed

1. **Address Age**
   - New addresses (high risk): +20 points
   - Established addresses: +0 points

2. **Blacklist Screening**
   - Known scammer addresses: +50 points
   - Sanctioned addresses: +100 points

3. **Transaction Patterns**
   - Mixing service patterns: +30 points
   - MEV bot patterns (EVM): +15 points
   - Unusual activity: +10 points

4. **Amount-Based Risk**
   - Large transactions (>$10k): +5 points
   - Very large (>$100k): +10 points

5. **Chain-Specific Risks**
   - EVM chains: MEV bot detection
   - Solana: Pump-and-dump patterns
   - Bitcoin: Mixing service detection

#### Risk Scoring

- **0-20**: Low risk (green)
- **21-50**: Medium risk (yellow)
- **51-100**: High risk (red)

### Security Scanner Component

The `SecurityScanner` component provides real-time visual feedback:

```typescript
<SecurityScanner
  address={toAddress}
  chainType={activeChain.type}
  amount={parseFloat(amount)}
  onComplete={(analysis) => {
    // Handle risk analysis results
  }}
/>
```

Features:
- Animated progress bar
- Step-by-step scan logging
- Risk factor breakdown
- Actionable recommendations
- Chain-specific warnings

### Recommendations System

Based on risk analysis, the scanner provides recommendations:

- **Low Risk**: "Transaction appears safe to proceed"
- **Medium Risk**: "Proceed with caution" + specific warnings
- **High Risk**: "Consider canceling transaction" + detailed reasons

## Fee Estimation

### Chain-Specific Fee Calculation

Each blockchain has different fee structures:

#### EVM Chains
```typescript
{
  networkFee: '~0.002 ETH',
  gasPrice: '25 Gwei',
  estimatedTime: '~30 seconds'
}
```

#### Solana
```typescript
{
  networkFee: '~0.000005 SOL',
  gasPrice: '1 lamport',
  estimatedTime: '~400ms'
}
```

#### Bitcoin
```typescript
{
  networkFee: '~0.0001 BTC',
  gasPrice: '20 sat/vB',
  estimatedTime: '~10 minutes'
}
```

#### Sui
```typescript
{
  networkFee: '~0.001 SUI',
  gasPrice: '1000 MIST',
  estimatedTime: '~2 seconds'
}
```

### Usage

```typescript
import { estimateFees } from '../utils/blockchain';

const fees = await estimateFees(chainType, amount);
console.log(fees.networkFee, fees.estimatedTime);
```

## Transaction Flow

### Send Transaction Process

1. **Address Entry**: User enters recipient address or domain
2. **Validation**: Real-time address format validation
3. **Amount Entry**: Balance checking and USD conversion
4. **Security Scan**: Comprehensive risk analysis
5. **Fee Estimation**: Dynamic fee calculation
6. **Confirmation**: Summary of transaction details
7. **Signing**: Transaction signing (simulated in demo)
8. **Broadcasting**: Network submission
9. **Success**: Transaction hash and explorer link

### Receive Flow

1. **Chain Selection**: Choose blockchain network
2. **QR Code Display**: Deterministic QR code generation
3. **Address Display**: Copy/share functionality
4. **Network Warning**: Chain-specific warnings
5. **Security Tips**: Best practices for receiving

## Transaction Signing (Demo Mode)

In demo mode, transactions are simulated:

```typescript
const result = await sendTransaction(
  fromAddress,
  toAddress,
  amount,
  chainType,
  chainId
);

// Returns: { txHash, explorerUrl, timestamp }
```

**Note**: Production implementation should integrate:
- Hardware wallet support (Ledger, Trezor)
- Mobile wallet SDKs (WalletConnect, Phantom)
- Biometric signing confirmation
- Multi-signature support

## Adding New Blockchains

### Step 1: Define Chain Configuration

Add to `constants/chains.ts`:

```typescript
export const CHAINS: Record<string, Chain> = {
  // ... existing chains
  NEWCHAIN: {
    id: 'newchain',
    name: 'New Chain',
    symbol: 'NEW',
    type: 'EVM', // or 'SOLANA' | 'BITCOIN' | 'SUI' | new type
    icon: '◆',
    color: '#FF5733',
    decimals: 18,
    rpcUrl: 'https://rpc.newchain.io',
    explorerUrl: 'https://explorer.newchain.io',
    chainId: 999, // if EVM
  },
};
```

### Step 2: Add Chain Group

```typescript
export const CHAIN_GROUPS = {
  EVM: ['ETHEREUM', 'POLYGON', 'BSC', 'ARBITRUM', 'OPTIMISM', 'AVALANCHE', 'NEWCHAIN'],
  // or
  NON_EVM: ['SOLANA', 'BITCOIN', 'SUI', 'NEWCHAIN'],
};
```

### Step 3: Add Address Validation (if new type)

If adding a new chain type, update `utils/blockchain.ts`:

```typescript
const ADDRESS_PATTERNS = {
  // ... existing patterns
  NEWTYPE: /^[your-regex-pattern]$/,
};
```

### Step 4: Update Fee Estimation

Add chain-specific fee logic in `estimateFees()`:

```typescript
case 'NEWTYPE':
  return {
    networkFee: '~0.001 NEW',
    gasPrice: '10 units',
    estimatedTime: '~5 seconds',
  };
```

### Step 5: Add to Store

Initialize in `store/multiChainStore.ts`:

```typescript
addresses: [
  // ... existing addresses
  { chainId: 'newchain', address: '0x...' },
],
balances: [
  // ... existing balances
  { chainId: 'newchain', balance: 0, usdValue: 0, price: 0 },
],
```

## Security Best Practices

### For Users

1. **Always verify the network** before sending or receiving
2. **Double-check addresses** - blockchain transactions are irreversible
3. **Test with small amounts** when using new addresses
4. **Never share private keys** or seed phrases
5. **Use hardware wallets** for large amounts (production)

### For Developers

1. **Validate all inputs** - never trust user input
2. **Use deterministic algorithms** - avoid randomness in critical paths
3. **Implement rate limiting** - prevent spam and DOS attacks
4. **Log security events** - track suspicious activity
5. **Keep dependencies updated** - regularly audit third-party code
6. **Test on testnets first** - always test before mainnet deployment

## Risk Analysis Algorithm

### Deterministic Scoring

The risk analysis uses deterministic hashing to ensure consistent results:

```typescript
const hash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};
```

### Risk Factor Generation

Risk factors are deterministically generated based on:
- Address hash value
- Chain type
- Transaction amount
- Historical patterns (simulated in demo)

### Example Risk Output

```typescript
{
  score: 15,
  level: 'low',
  factors: [
    {
      category: 'Address Age',
      description: 'Address is relatively new',
      severity: 'low',
      points: 15
    }
  ],
  recommendations: [
    'Transaction appears safe to proceed',
    'Always verify the recipient address',
  ]
}
```

## QR Code Generation

### Deterministic QR Codes

QR codes are generated deterministically from addresses:

```typescript
const generateQRCode = (data: string) => {
  const size = 21; // Standard QR code size
  const modules: boolean[][] = [];

  for (let row = 0; row < size; row++) {
    modules[row] = [];
    for (let col = 0; col < size; col++) {
      const index = (row * size + col) % data.length;
      const charCode = data.charCodeAt(index);
      modules[row][col] = (charCode + row + col) % 2 === 0;
    }
  }

  return modules;
};
```

**Note**: Production apps should use proper QR code libraries like `react-native-qrcode-svg` for standard-compliant QR codes.

## Chain-Specific Features

### Ethereum (EVM)
- Smart contract interactions
- ERC-20 token support
- ENS domain resolution
- MEV protection

### Solana
- High-speed transactions
- Low fees
- SPL token support
- SNS domain resolution

### Bitcoin
- UTXO model
- SegWit support
- Lightning Network ready
- Multi-signature support

### Sui
- Move-based smart contracts
- Parallel execution
- Object-centric model
- SuiNS domain resolution

## Testing

### Test Addresses

Use these test addresses for each chain:

```typescript
// EVM (all EVM chains use same format)
const evmTest = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

// Solana
const solanaTest = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';

// Bitcoin (SegWit)
const bitcoinTest = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';

// Sui
const suiTest = '0x02a212de6a9dfa3a69e22387acfbafbb1a9e591bd9d636e7895dcfc8de05f331';
```

### Manual Testing Checklist

- [ ] Chain selection works for all chains
- [ ] Address validation catches invalid addresses
- [ ] Security scanner runs for all chain types
- [ ] QR codes generate correctly
- [ ] Fee estimation displays for all chains
- [ ] Transaction flow completes end-to-end
- [ ] Copy/share functionality works
- [ ] Network warnings display correctly
- [ ] Balance updates after transactions

## API Integration (Future)

For production deployment, integrate real blockchain APIs:

### EVM Chains
- **Infura**: https://infura.io
- **Alchemy**: https://alchemy.com
- **QuickNode**: https://quicknode.com

### Solana
- **Solana RPC**: https://docs.solana.com/api
- **Helius**: https://helius.dev
- **GenesysGo**: https://genesysgo.com

### Bitcoin
- **Blockchain.info**: https://blockchain.info/api
- **Blockstream**: https://blockstream.info/api
- **Electrum**: Custom server

### Sui
- **Sui RPC**: https://docs.sui.io/build/json-rpc

## Troubleshooting

### Common Issues

**Issue**: Address validation fails for valid addresses
- **Solution**: Check chain type matches address format

**Issue**: QR code not displaying
- **Solution**: Verify address string is not empty

**Issue**: Fee estimation shows "Estimating..."
- **Solution**: Check RPC endpoint connectivity (in production)

**Issue**: Security scan stuck at 0%
- **Solution**: Verify analyzeAddressRisk() completes

## Performance Considerations

### Optimization Tips

1. **Lazy load chain data** - Only load active chain details
2. **Cache risk analysis** - Store results for recently scanned addresses
3. **Debounce address validation** - Avoid validating on every keystroke
4. **Optimize QR rendering** - Use memoization for QR code generation
5. **Batch balance updates** - Update all chain balances in single operation

## Future Enhancements

### Planned Features

- [ ] Hardware wallet integration (Ledger, Trezor)
- [ ] WalletConnect v2 support
- [ ] Token support (ERC-20, SPL, etc.)
- [ ] NFT gallery view
- [ ] DEX integration (Uniswap, Raydium, etc.)
- [ ] Staking support
- [ ] Multi-signature wallets
- [ ] Transaction batching
- [ ] Gas price optimization
- [ ] Custom RPC endpoints
- [ ] Testnet support
- [ ] Transaction history export
- [ ] Address book management
- [ ] Fiat on/off ramps

### Research Areas

- Zero-knowledge proof integrations
- Account abstraction (ERC-4337)
- Cross-chain bridging
- Layer 2 rollups
- Privacy protocols (Tornado Cash alternatives)

## Resources

### Documentation
- [Ethereum JSON-RPC](https://ethereum.org/en/developers/docs/apis/json-rpc/)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Bitcoin RPC](https://developer.bitcoin.org/reference/rpc/)
- [Sui TypeScript SDK](https://docs.sui.io/build/typescript-sdk)

### Community
- [Ethereum Stack Exchange](https://ethereum.stackexchange.com/)
- [Solana Stack Exchange](https://solana.stackexchange.com/)
- [Bitcoin Stack Exchange](https://bitcoin.stackexchange.com/)
- [Sui Discord](https://discord.gg/sui)

---

**Version**: 1.0.0
**Last Updated**: 2025-01-XX
**Maintainer**: Vault Terminal Team
