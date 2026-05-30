import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import Svg, { Polygon, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { AppStatusBar, ScreenHeader, TerminalCard, VaultButton, BottomNav, ChainSelector, SecurityScanner } from '../components';
import { useMultiChainStore, shortAddr, fmtUsd } from '../store/multiChainStore';
import { Colors } from '../constants/colors';
import { validateAddress, estimateFees, sendTransaction, RiskAnalysis } from '../utils/blockchain';

type Step = 'form' | 'scanning' | 'confirm' | 'success';

export default function SendMultiChain() {
  const router = useRouter();
  const {
    getActiveChain,
    getActiveAddress,
    getActiveBalance,
    addTransaction,
    updateBalance,
  } = useMultiChainStore();

  const activeChain = getActiveChain();
  const fromAddress = getActiveAddress();
  const balance = getActiveBalance();

  const [step, setStep] = useState<Step>('form');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [feeEstimate, setFeeEstimate] = useState<any>(null);
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);
  const [txResult, setTxResult] = useState<any>(null);
  const [validationError, setValidationError] = useState('');

  const handleAddressChange = (addr: string) => {
    setToAddress(addr);
    setValidationError('');

    if (addr.length > 10) {
      const validation = validateAddress(addr, activeChain.type);
      if (!validation.isValid) {
        setValidationError(validation.error || 'Invalid address');
      }
    }
  };

  const handleScan = async () => {
    const validation = validateAddress(toAddress, activeChain.type);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid address');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setValidationError('Please enter a valid amount');
      return;
    }

    // Estimate fees
    const fees = await estimateFees(activeChain.type, parseFloat(amount));
    setFeeEstimate(fees);

    setStep('scanning');
  };

  const handleScanComplete = (analysis: RiskAnalysis) => {
    setRiskAnalysis(analysis);
    setTimeout(() => setStep('confirm'), 500);
  };

  const handleConfirm = async () => {
    setStep('success');

    // Send transaction
    const result = await sendTransaction(
      fromAddress,
      toAddress,
      amount,
      activeChain.type,
      activeChain.id
    );
    setTxResult(result);

    // Add to transaction history
    const usdValue = (parseFloat(amount) * (balance?.price || 0));
    addTransaction({
      type: 'send',
      asset: activeChain.symbol,
      amount: `-${amount}`,
      usd: `-${fmtUsd(usdValue)}`,
      to: shortAddr(toAddress),
      from: shortAddr(fromAddress),
      time: 'JUST NOW',
      risk: riskAnalysis?.score || 0,
      chainId: activeChain.id,
      txHash: result.txHash,
      status: 'confirmed',
    });

    // Update balance (subtract amount + fee)
    const newBalance = (balance?.balance || 0) - parseFloat(amount) - 0.001;
    updateBalance(activeChain.id, Math.max(0, newBalance), balance?.price || 0);
  };

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };

  return (
    <View style={styles.container}>
      <AppStatusBar />
      <ScreenHeader
        title="Send Crypto"
        subtitle={`> ${activeChain.type} network`}
        onBack={() => router.back()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {step === 'form' && (
          <>
            {/* Chain Selector */}
            <ChainSelector showBalance />

            {/* Recipient Address */}
            <View>
              <Text style={styles.label}>RECIPIENT ADDRESS</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={toAddress}
                  onChangeText={handleAddressChange}
                  placeholder={`${activeChain.type} address or domain`}
                  placeholderTextColor={Colors.textDim}
                  style={[
                    styles.input,
                    toAddress && !validationError && styles.inputActive,
                    validationError && styles.inputError,
                  ]}
                />
                <Svg style={styles.inputIcon} width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <Rect x="3" y="3" width="7" height="7" stroke={Colors.textDim} strokeWidth="1.5" strokeLinecap="square"/>
                  <Rect x="14" y="3" width="7" height="7" stroke={Colors.textDim} strokeWidth="1.5" strokeLinecap="square"/>
                  <Rect x="3" y="14" width="7" height="7" stroke={Colors.textDim} strokeWidth="1.5" strokeLinecap="square"/>
                  <Rect x="14" y="14" width="3" height="3" stroke={Colors.textDim} strokeWidth="1.5" strokeLinecap="square"/>
                </Svg>
              </View>
              {validationError && <Text style={styles.errorText}>✕ {validationError}</Text>}
              {toAddress && !validationError && toAddress.length > 10 && (
                <Text style={styles.validation}>✓ valid {activeChain.type} address format</Text>
              )}
            </View>

            {/* Amount */}
            <View>
              <Text style={styles.label}>AMOUNT</Text>
              <View style={styles.amountRow}>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00000000"
                  placeholderTextColor={Colors.textDim}
                  keyboardType="numeric"
                  style={[
                    styles.amountInput,
                    amount && styles.inputActive
                  ]}
                />
                <View style={styles.assetBadge}>
                  <View style={[styles.chainIconMini, { backgroundColor: activeChain.color + '20', borderColor: activeChain.color }]}>
                    <Text style={[styles.chainIconMiniText, { color: activeChain.color }]}>{activeChain.icon}</Text>
                  </View>
                  <Text style={styles.assetText}>{activeChain.symbol}</Text>
                </View>
              </View>
              {amount && balance && (
                <>
                  <Text style={styles.usdValue}>
                    ≈ ${(parseFloat(amount) * balance.price).toFixed(2)} USD
                  </Text>
                  <Text style={styles.balanceAvailable}>
                    Available: {balance.balance.toFixed(activeChain.decimals > 8 ? 8 : activeChain.decimals)} {activeChain.symbol}
                  </Text>
                </>
              )}
            </View>

            <VaultButton
              onPress={handleScan}
              variant={toAddress && amount && !validationError ? 'primary' : 'ghost'}
            >
              <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </Svg>
              <Text>SCAN & RISK CHECK</Text>
            </VaultButton>
          </>
        )}

        {/* Scanning State */}
        {step === 'scanning' && (
          <SecurityScanner
            address={toAddress}
            chainType={activeChain.type}
            amount={parseFloat(amount)}
            onComplete={handleScanComplete}
          />
        )}

        {/* Confirm State */}
        {step === 'confirm' && riskAnalysis && (
          <>
            <TerminalCard glow>
              <Text style={styles.summaryLabel}>TRANSACTION SUMMARY</Text>
              {[
                ['NETWORK', activeChain.name],
                ['FROM', shortAddr(fromAddress)],
                ['TO', shortAddr(toAddress)],
                ['AMOUNT', `${amount} ${activeChain.symbol}`],
                ['VALUE', `≈ $${((parseFloat(amount)) * (balance?.price || 0)).toFixed(2)} USD`],
                ['FEE', feeEstimate?.networkFee || 'Estimating...'],
                ['TIME', feeEstimate?.estimatedTime || 'Unknown'],
              ].map(([k, v]) => (
                <View key={k} style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>{k}</Text>
                  <Text style={styles.summaryValue}>{v}</Text>
                </View>
              ))}
            </TerminalCard>

            <VaultButton onPress={handleConfirm}>
              CONFIRM & SIGN
            </VaultButton>
            <VaultButton variant="ghost" onPress={() => setStep('form')}>
              CANCEL
            </VaultButton>
          </>
        )}

        {/* Success */}
        {step === 'success' && txResult && (
          <TerminalCard glow style={styles.successCard}>
            <Text style={styles.successTitle}>TRANSACTION SENT</Text>
            <View style={styles.successDetails}>
              <Text style={styles.successChain}>{activeChain.name}</Text>
              <Text style={styles.successAmount}>
                {amount} {activeChain.symbol}
              </Text>
            </View>
            <Text style={styles.txHash}>
              TX: {txResult.txHash?.slice(0, 16)}...{txResult.txHash?.slice(-8)}
            </Text>
            <Text style={styles.explorerLink}>
              View on {activeChain.name} Explorer
            </Text>
            <VaultButton small onPress={() => router.back()} style={{ marginTop: 16 }}>
              BACK TO WALLET
            </VaultButton>
          </TerminalCard>
        )}
      </ScrollView>

      <BottomNav active="send" onNavigate={handleNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 14,
    gap: 12,
  },
  label: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    width: '100%',
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: 4,
    padding: 11,
    paddingRight: 36,
    fontFamily: 'System',
    fontSize: 12,
    color: Colors.cyanAccent,
  },
  inputActive: {
    borderColor: Colors.greenPrimary,
    shadowColor: 'rgba(0,255,136,0.2)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  inputError: {
    borderColor: Colors.redDanger,
  },
  inputIcon: {
    position: 'absolute',
    right: 10,
    top: 11,
  },
  validation: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.greenDim,
    marginTop: 4,
  },
  errorText: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.redDanger,
    marginTop: 4,
  },
  amountRow: {
    flexDirection: 'row',
    gap: 8,
  },
  amountInput: {
    flex: 1,
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: 4,
    padding: 11,
    paddingHorizontal: 12,
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  assetBadge: {
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: 4,
    padding: 11,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chainIconMini: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chainIconMiniText: {
    fontSize: 10,
    fontWeight: '700',
  },
  assetText: {
    fontFamily: 'System',
    fontSize: 12,
    color: Colors.textMuted,
  },
  usdValue: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 4,
  },
  balanceAvailable: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    marginTop: 2,
  },
  summaryLabel: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 1.8,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryKey: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 1.2,
  },
  summaryValue: {
    fontFamily: 'System',
    fontSize: 11,
    color: Colors.white,
  },
  successCard: {
    alignItems: 'center',
    padding: 28,
    paddingHorizontal: 20,
  },
  successTitle: {
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '700',
    color: Colors.greenPrimary,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,255,136,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  successDetails: {
    alignItems: 'center',
    marginBottom: 16,
  },
  successChain: {
    fontFamily: 'System',
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  successAmount: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  txHash: {
    fontFamily: 'System',
    fontSize: 10,
    color: Colors.cyanAccent,
    marginBottom: 8,
  },
  explorerLink: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    textDecorationLine: 'underline',
  },
});
