import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Share } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { AppStatusBar, ScreenHeader, TerminalCard, VaultButton, BottomNav, ChainSelector } from '../components';
import { useMultiChainStore, shortAddr } from '../store/multiChainStore';
import { Colors } from '../constants/colors';

export default function ReceiveMultiChain() {
  const router = useRouter();
  const { getActiveChain, getActiveAddress } = useMultiChainStore();

  const [copied, setCopied] = useState(false);

  const activeChain = getActiveChain();
  const address = getActiveAddress();

  // Generate deterministic QR code based on address
  const generateQRCode = (data: string) => {
    const size = 21; // QR code grid size
    const modules: boolean[][] = [];

    // Simple deterministic pattern generation from address
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

  const qrModules = generateQRCode(address);
  const moduleSize = 10;
  const qrSize = qrModules.length * moduleSize;

  const handleCopy = async () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${activeChain.name} Address:\n${address}`,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };

  // Chain-specific warnings and info
  const getChainWarning = () => {
    switch (activeChain.type) {
      case 'EVM':
        return `Only send ${activeChain.symbol} or ERC-20 tokens on ${activeChain.name}. Sending from other EVM chains may result in loss of funds.`;
      case 'SOLANA':
        return 'Only send SOL or SPL tokens on Solana network. Do not send from other chains.';
      case 'BITCOIN':
        return 'Only send BTC on Bitcoin network. Ensure you are using the correct address format (SegWit recommended).';
      case 'SUI':
        return 'Only send SUI or Sui-native tokens. Do not send from other chains.';
      default:
        return 'Ensure you are sending from the correct network to avoid loss of funds.';
    }
  };

  const getAddressFormat = () => {
    switch (activeChain.type) {
      case 'EVM':
        return 'EVM-compatible (0x...)';
      case 'SOLANA':
        return 'Solana Base58';
      case 'BITCOIN':
        return address.startsWith('bc1') ? 'SegWit (bc1...)' : 'Legacy';
      case 'SUI':
        return 'Sui Address (0x...)';
      default:
        return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <AppStatusBar />
      <ScreenHeader
        title="Receive Crypto"
        subtitle={`> ${activeChain.type} network`}
        onBack={() => router.back()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Chain Selector */}
        <ChainSelector showBalance />

        {/* QR Code Card */}
        <TerminalCard glow style={styles.qrCard}>
          <View style={styles.qrHeader}>
            <View style={[styles.chainIcon, { backgroundColor: activeChain.color + '20', borderColor: activeChain.color }]}>
              <Text style={[styles.chainIconText, { color: activeChain.color }]}>{activeChain.icon}</Text>
            </View>
            <View style={styles.chainInfo}>
              <Text style={styles.chainName}>{activeChain.name}</Text>
              <Text style={styles.chainFormat}>{getAddressFormat()}</Text>
            </View>
          </View>

          {/* QR Code */}
          <View style={styles.qrContainer}>
            <Svg width={qrSize} height={qrSize} viewBox={`0 0 ${qrSize} ${qrSize}`}>
              {qrModules.map((row, y) =>
                row.map((isDark, x) =>
                  isDark ? (
                    <Rect
                      key={`${y}-${x}`}
                      x={x * moduleSize}
                      y={y * moduleSize}
                      width={moduleSize}
                      height={moduleSize}
                      fill={Colors.bgPrimary}
                    />
                  ) : null
                )
              )}
            </Svg>
          </View>

          <Text style={styles.qrLabel}>Scan to send {activeChain.symbol}</Text>
        </TerminalCard>

        {/* Address Display */}
        <TerminalCard>
          <Text style={styles.sectionLabel}>YOUR {activeChain.symbol} ADDRESS</Text>

          <View style={styles.addressBox}>
            <Text style={styles.addressText}>{address}</Text>
          </View>

          <View style={styles.actionButtons}>
            <VaultButton
              variant={copied ? 'primary' : 'outline'}
              small
              onPress={handleCopy}
              style={{ flex: 1 }}
            >
              <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <Rect x="9" y="9" width="13" height="13" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
                <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
              </Svg>
              <Text>{copied ? 'COPIED!' : 'COPY'}</Text>
            </VaultButton>

            <VaultButton
              variant="outline"
              small
              onPress={handleShare}
              style={{ flex: 1 }}
            >
              <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <Path d="M16 6l-4-4-4 4"/>
                <Path d="M12 2v13"/>
              </Svg>
              <Text>SHARE</Text>
            </VaultButton>
          </View>
        </TerminalCard>

        {/* Network Warning */}
        <TerminalCard warn>
          <View style={styles.warningHeader}>
            <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={Colors.yellowWarning} strokeWidth="2" strokeLinecap="square"/>
              <Path d="M12 9v4M12 17h.01" stroke={Colors.yellowWarning} strokeWidth="2" strokeLinecap="square"/>
            </Svg>
            <Text style={styles.warningTitle}>NETWORK WARNING</Text>
          </View>
          <Text style={styles.warningText}>{getChainWarning()}</Text>
        </TerminalCard>

        {/* Chain-Specific Info */}
        <TerminalCard>
          <Text style={styles.sectionLabel}>NETWORK DETAILS</Text>

          {[
            ['Network', activeChain.name],
            ['Chain Type', activeChain.type],
            ['Symbol', activeChain.symbol],
            ['Decimals', activeChain.decimals.toString()],
            ...(activeChain.chainId ? [['Chain ID', activeChain.chainId.toString()]] : []),
          ].map(([key, value]) => (
            <View key={key} style={styles.detailRow}>
              <Text style={styles.detailKey}>{key}</Text>
              <Text style={styles.detailValue}>{value}</Text>
            </View>
          ))}

          {/* Explorer Link */}
          <TouchableOpacity style={styles.explorerLink}>
            <Text style={styles.explorerText}>View on {activeChain.name} Explorer →</Text>
          </TouchableOpacity>
        </TerminalCard>

        {/* Security Tips */}
        <TerminalCard>
          <Text style={styles.sectionLabel}>SECURITY TIPS</Text>

          {[
            'Always verify the network before sharing your address',
            'Double-check the sender is using the correct blockchain',
            'Never share your private key or seed phrase',
            'Be cautious of addresses sent via untrusted channels',
            'Test with a small amount first for new senders',
          ].map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </TerminalCard>
      </ScrollView>

      <BottomNav active="wallet" onNavigate={handleNavigate} />
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
  qrCard: {
    alignItems: 'center',
    padding: 20,
  },
  qrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  chainIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chainIconText: {
    fontSize: 18,
    fontWeight: '700',
  },
  chainInfo: {
    gap: 2,
  },
  chainName: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  chainFormat: {
    fontFamily: 'System',
    fontSize: 10,
    color: Colors.textMuted,
  },
  qrContainer: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  qrLabel: {
    fontFamily: 'System',
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  sectionLabel: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  addressBox: {
    backgroundColor: Colors.bgPrimary,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: 6,
    padding: 14,
    marginBottom: 12,
  },
  addressText: {
    fontFamily: 'System',
    fontSize: 11,
    color: Colors.cyanAccent,
    textAlign: 'center',
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  warningTitle: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '700',
    color: Colors.yellowWarning,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  warningText: {
    fontFamily: 'System',
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 17,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  detailKey: {
    fontFamily: 'System',
    fontSize: 10,
    color: Colors.textDim,
    letterSpacing: 0.5,
  },
  detailValue: {
    fontFamily: 'System',
    fontSize: 11,
    color: Colors.white,
    fontWeight: '600',
  },
  explorerLink: {
    marginTop: 12,
    padding: 8,
    alignItems: 'center',
  },
  explorerText: {
    fontFamily: 'System',
    fontSize: 10,
    color: Colors.cyanAccent,
    textDecorationLine: 'underline',
  },
  tipRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
    alignItems: 'flex-start',
  },
  tipBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.greenPrimary,
    marginTop: 6,
  },
  tipText: {
    flex: 1,
    fontFamily: 'System',
    fontSize: 10,
    color: Colors.textMuted,
    lineHeight: 16,
  },
});
