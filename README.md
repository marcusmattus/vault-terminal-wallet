# Vault Terminal Wallet

A cyberpunk-themed crypto wallet app built with Expo and React Native, implementing the Vault Terminal Wallet design system.

## Features

- **Terminal Boot Screen** - Animated splash with boot log
- **Biometric/PIN Unlock** - Face ID and PIN authentication
- **Multi-Chain Wallet** - Support for 9 blockchain networks
- **Chain Selector** - Switch between EVM, Solana, Bitcoin, and Sui chains
- **Wallet Dashboard** - Balance card, quick actions, transaction history
- **Send Crypto** - Send flow with live risk scan animation
- **Receive** - QR code display and address sharing
- **Security Scanner** - Real-time blockchain address risk analysis
- **KYC Status** - Verification tier levels and session log
- **Security Centre** - Biometrics, spending limits, trusted devices

## Design System

The app implements a terminal/cyberpunk aesthetic with:

- **Colors**: Dark backgrounds (#050505, #0D1117) with neon green accents (#00FF88)
- **Typography**: Monospace fonts (JetBrains Mono, Space Mono, IBM Plex Mono)
- **Components**: Terminal cards, glowing borders, scanline effects
- **Navigation**: Bottom tab navigation with active glow effects

## Supported Blockchains

### EVM-Compatible Chains
- **Ethereum** (ETH) - Mainnet
- **Polygon** (MATIC) - PoS Chain
- **BNB Chain** (BNB) - Formerly BSC
- **Arbitrum One** (ETH) - L2 Rollup
- **Optimism** (ETH) - L2 Rollup
- **Avalanche C-Chain** (AVAX) - EVM Compatible

### Non-EVM Chains
- **Solana** (SOL) - High-performance blockchain
- **Bitcoin** (BTC) - Original cryptocurrency
- **Sui Network** (SUI) - Next-gen smart contract platform

## Tech Stack

- **Expo SDK 56** - React Native framework
- **Expo Router** - File-based navigation
- **Zustand** - State management
- **React Native SVG** - Vector graphics and QR codes
- **TypeScript** - Type safety
- **Multi-Chain Support** - EVM, Solana, Bitcoin, Sui

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Project Structure

```
/app                         # Expo Router screens
  ├── _layout.tsx            # Root layout
  ├── index.tsx              # Original Wallet Dashboard
  ├── index-multichain.tsx   # Multi-Chain Dashboard
  ├── boot.tsx               # Boot/Splash screen
  ├── unlock.tsx             # Unlock screen
  ├── send.tsx               # Original Send screen
  ├── send-multichain.tsx    # Multi-Chain Send screen
  ├── receive.tsx            # Original Receive screen
  ├── receive-multichain.tsx # Multi-Chain Receive screen
  ├── kyc.tsx                # KYC status screen
  └── security.tsx           # Security centre screen
/components                  # Reusable UI components
  ├── StatusBar.tsx
  ├── TerminalCard.tsx
  ├── VaultButton.tsx
  ├── ScreenHeader.tsx
  ├── BottomNav.tsx
  ├── ChainSelector.tsx      # Blockchain network selector
  ├── SecurityScanner.tsx    # Real-time risk analysis
  └── ...
/constants                   # Configuration
  ├── colors.ts              # Theme colors
  └── chains.ts              # Blockchain definitions
/store                       # Zustand state management
  ├── appStore.ts            # Original app state
  └── multiChainStore.ts     # Multi-chain wallet state
/utils                       # Utilities
  └── blockchain.ts          # Address validation, risk analysis, fees
```

## Screens

### Boot Screen
- Classic variant with typed boot log
- Minimal variant with progress bar
- Auto-advances to unlock screen

### Unlock Screen
- Face ID/Biometric authentication
- PIN fallback (demo PIN: 424242)
- Animated scanning states

### Wallet Dashboard
- ETH balance display
- Quick send/receive actions
- Recent transaction history
- Copy address functionality

### Send Crypto
- Address input with validation
- Amount input with USD conversion
- Risk scanning animation
- Transaction confirmation

### Receive
- QR code generation
- Asset selector (ETH/USDC)
- Address display and copy
- Network warning

### KYC Status
- Verification tier levels
- Session log with timestamps
- Current status hero card

### Security Centre
- Biometric/PIN toggles
- Spending limits display
- Trusted devices list
- Recovery phrase access

## Multi-Chain Features

### Chain Selector
- Modal with scrollable network list
- Grouped by EVM and Non-EVM chains
- Real-time balance display for each chain
- Active chain indicator with glow effect

### Multi-Chain Dashboard
- Total portfolio value across all networks
- Active chain balance card with network icon
- Chain-specific transaction filtering
- All networks overview grid

### Multi-Chain Send
- Chain-specific address validation (EVM, Solana, Bitcoin, Sui)
- Real-time security scanning with risk analysis
- Dynamic fee estimation per network
- Chain-specific warnings and recommendations
- Transaction confirmation with full details

### Multi-Chain Receive
- Deterministic QR code generation
- Chain-specific address formats
- Network warnings to prevent wrong-chain transfers
- Copy/share functionality
- Security tips for receiving crypto

### Security Scanner
- Real-time blockchain address analysis
- Blacklist screening
- Transaction pattern detection
- Risk scoring (0-100) with severity levels
- Actionable recommendations
- Chain-specific risk factors

## Blockchain Security

The app includes comprehensive security features:

- **Address Validation**: Chain-specific regex patterns for all networks
- **Risk Analysis**: Deterministic risk scoring algorithm
- **Blacklist Screening**: Checks against known scammer addresses
- **Transaction Patterns**: Detects mixing services and suspicious activity
- **Amount-Based Risk**: Flags large or unusual transactions
- **Chain-Specific Checks**: MEV bots (EVM), pump-and-dump (Solana), mixing (Bitcoin)

See [BLOCKCHAIN.md](./BLOCKCHAIN.md) for detailed documentation.

## Design Implementation

This implementation is a pixel-perfect translation from the HTML/CSS prototypes created in Claude Design. All visual elements, colors, typography, and interactions match the original design specifications.

## License

MIT
