import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { AppStatusBar, ScreenHeader, TerminalCard, VaultButton, BottomNav, RiskBadge, PromptLine, BlinkCursor } from '../components';
import { useAppStore, fmtUsd } from '../store/appStore';
import { Colors } from '../constants/colors';

type Step = 'form' | 'scanning' | 'confirm' | 'success';

export default function SendCrypto() {
  const router = useRouter();
  const { ethPrice, balanceEth, addTransaction, updateBalance } = useAppStore();
  const [step, setStep] = useState<Step>('form');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [riskScore] = useState(12);

  const scanLines = [
    'resolving address...',
    'checking blacklist database...',
    'querying AML screening...',
    'scoring transaction risk...',
    'analysis complete.',
  ];
  const visibleScanLines = Math.floor((scanProgress / 100) * scanLines.length);

  const handleScan = () => {
    if (!address || !amount) return;
    setStep('scanning');
    setScanProgress(0);
  };

  useEffect(() => {
    if (step === 'scanning') {
      const interval = setInterval(() => {
        setScanProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setStep('confirm');
            return 100;
          }
          return p + 4;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [step]);

  const commitTx = () => {
    const amt = parseFloat(amount) || 0.15;
    const usd = amt * ethPrice;
    const newTx = {
      type: 'send' as const,
      asset: 'ETH',
      amount: '-' + amt.toFixed(8),
      usd: '-' + fmtUsd(usd),
      to: address ? `${address.slice(0,6)}...${address.slice(-4)}` : '0xAb1C...77fF',
      time: 'JUST NOW',
      risk: riskScore,
      chain: 'ETH',
    };
    addTransaction(newTx);
    updateBalance(Math.max(0, balanceEth - amt - 0.00142));
    setStep('success');
  };

  const handleNavigate = (screen: string) => {
    router.push(`/${screen === 'wallet' ? '' : screen}`);
  };

  return (
    <View style={styles.container}>
      <AppStatusBar />
      <ScreenHeader
        title="Send Crypto"
        subtitle="> risk engine active"
        onBack={() => router.back()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {(step === 'form' || step === 'scanning') && (
          <>
            {/* Address Field */}
            <View>
              <Text style={styles.label}>RECIPIENT ADDRESS</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="0x... or ENS name"
                  placeholderTextColor={Colors.textDim}
                  style={[
                    styles.input,
                    address && styles.inputActive
                  ]}
                />
                <Svg style={styles.inputIcon} width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <Rect x="3" y="3" width="7" height="7" stroke={Colors.textDim} strokeWidth="1.5" strokeLinecap="square"/>
                  <Rect x="14" y="3" width="7" height="7" stroke={Colors.textDim} strokeWidth="1.5" strokeLinecap="square"/>
                  <Rect x="3" y="14" width="7" height="7" stroke={Colors.textDim} strokeWidth="1.5" strokeLinecap="square"/>
                  <Rect x="14" y="14" width="3" height="3" stroke={Colors.textDim} strokeWidth="1.5" strokeLinecap="square"/>
                </Svg>
              </View>
              {address && <Text style={styles.validation}>✓ valid address format</Text>}
            </View>

            {/* Amount Field */}
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
                  <View style={styles.ethIcon}>
                    <Text style={styles.ethSymbol}>Ξ</Text>
                  </View>
                  <Text style={styles.assetText}>ETH</Text>
                </View>
              </View>
              {amount && (
                <Text style={styles.usdValue}>
                  ≈ ${(parseFloat(amount) * ethPrice).toFixed(2)} USD
                </Text>
              )}
            </View>

            {/* Fee Estimate */}
            <TerminalCard style={styles.feeCard}>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>NETWORK FEE</Text>
                <Text style={styles.feeValue}>~0.00142 ETH</Text>
              </View>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>GAS PRICE</Text>
                <Text style={styles.feeValue}>18 GWEI</Text>
              </View>
            </TerminalCard>

            {/* Scan Button */}
            {step === 'form' && (
              <VaultButton
                onPress={handleScan}
                variant={address && amount ? 'primary' : 'ghost'}
              >
                <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                  <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </Svg>
                <Text>SCAN & RISK CHECK</Text>
              </VaultButton>
            )}
          </>
        )}

        {/* Scanning State */}
        {step === 'scanning' && (
          <TerminalCard glow>
            <Text style={styles.scanLabel}>RISK SCAN IN PROGRESS</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${scanProgress}%` }]} />
            </View>
            {scanLines.slice(0, visibleScanLines).map((line, i) => (
              <PromptLine
                key={i}
                color={i === visibleScanLines - 1 ? Colors.greenPrimary : Colors.textMuted}
                dim={i < visibleScanLines - 1}
              >
                {line}{i === visibleScanLines - 1 && scanProgress < 100 && <BlinkCursor />}
              </PromptLine>
            ))}
          </TerminalCard>
        )}

        {/* Confirm State */}
        {step === 'confirm' && (
          <>
            <TerminalCard glow>
              <Text style={styles.summaryLabel}>TRANSACTION SUMMARY</Text>
              {[
                ['FROM', '0x4f3a8b...9d2e'],
                ['TO', address || '0xAb1C3d...77fF'],
                ['AMOUNT', `${amount || '0.15'} ETH`],
                ['VALUE', `≈ $${((parseFloat(amount) || 0.15) * ethPrice).toFixed(2)} USD`],
                ['NETWORK', 'ETHEREUM MAINNET'],
                ['FEE', '~0.00142 ETH'],
              ].map(([k, v]) => (
                <View key={k} style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>{k}</Text>
                  <Text style={styles.summaryValue}>{v}</Text>
                </View>
              ))}
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>RISK SCORE</Text>
                <RiskBadge score={riskScore} />
              </View>
            </TerminalCard>
            <VaultButton onPress={commitTx}>CONFIRM & SIGN</VaultButton>
            <VaultButton variant="ghost" onPress={() => setStep('form')}>CANCEL</VaultButton>
          </>
        )}

        {/* Success */}
        {step === 'success' && (
          <TerminalCard glow style={styles.successCard}>
            <Text style={styles.successTitle}>TRANSACTION SENT</Text>
            <View style={styles.successLog}>
              <PromptLine>transaction broadcast to network</PromptLine>
              <PromptLine>awaiting confirmation...</PromptLine>
              <PromptLine color={Colors.greenPrimary}>risk cleared [12/100]</PromptLine>
            </View>
            <Text style={styles.txHash}>tx: 0x8f2a...d91c</Text>
            <VaultButton small onPress={() => router.back()}>BACK TO WALLET</VaultButton>
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
  ethIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.greenFaint,
    borderWidth: 1,
    borderColor: Colors.greenPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ethSymbol: {
    fontSize: 8,
    color: Colors.greenPrimary,
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
  feeCard: {
    padding: 10,
    paddingHorizontal: 12,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  feeLabel: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 1,
  },
  feeValue: {
    fontFamily: 'System',
    fontSize: 11,
    color: Colors.textMuted,
  },
  scanLabel: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 1.8,
    marginBottom: 10,
  },
  progressBar: {
    backgroundColor: '#0a0f14',
    borderRadius: 2,
    height: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.greenPrimary,
    shadowColor: 'rgba(0,255,136,0.6)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  summaryLabel: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 1.8,
    marginBottom: 10,
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
  summaryDivider: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    marginTop: 10,
    paddingTop: 10,
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
  },
  successLog: {
    marginBottom: 16,
  },
  txHash: {
    fontFamily: 'System',
    fontSize: 10,
    color: Colors.textDim,
    marginBottom: 20,
  },
});
