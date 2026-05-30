import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Line, Polygon, Polyline, Rect, Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { AppStatusBar, ScreenHeader, TerminalCard, VaultButton, BottomNav, KYCBadge, ChainSelector } from '../components';
import { useMultiChainStore, shortAddr, fmtUsd, getTotalPortfolioValue } from '../store/multiChainStore';
import { Colors } from '../constants/colors';
import { CHAINS } from '../constants/chains';

export default function MultiChainDashboard() {
  const router = useRouter();
  const {
    kyc,
    activeChainId,
    getActiveChain,
    getActiveAddress,
    getActiveBalance,
    getChainTransactions,
    balances,
  } = useMultiChainStore();

  const [copied, setCopied] = React.useState(false);

  const activeChain = getActiveChain();
  const address = getActiveAddress();
  const balance = getActiveBalance();
  const txs = getChainTransactions(activeChainId);
  const totalPortfolioValue = getTotalPortfolioValue(balances);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };

  return (
    <View style={styles.container}>
      <AppStatusBar />
      <ScreenHeader title="Multi-Chain Wallet" subtitle="> all networks active" />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Chain Selector */}
        <ChainSelector showBalance />

        {/* Total Portfolio Value */}
        <TerminalCard style={styles.portfolioCard}>
          <Text style={styles.portfolioLabel}>TOTAL PORTFOLIO VALUE</Text>
          <Text style={styles.portfolioValue}>{fmtUsd(totalPortfolioValue)}</Text>
          <Text style={styles.portfolioChains}>Across {balances.length} networks</Text>
        </TerminalCard>

        {/* Active Chain Balance */}
        <TerminalCard glow style={styles.balanceCard}>
          <View style={styles.chainHeader}>
            <View style={[styles.chainIconLarge, { backgroundColor: activeChain.color + '20', borderColor: activeChain.color }]}>
              <Text style={[styles.chainIconText, { color: activeChain.color }]}>{activeChain.icon}</Text>
            </View>
            <View style={styles.chainHeaderInfo}>
              <Text style={styles.chainHeaderName}>{activeChain.name}</Text>
              <KYCBadge status={kyc} />
            </View>
          </View>

          <Text style={styles.balanceLabel}>BALANCE</Text>
          <Text style={styles.balanceAmount}>
            {balance?.balance.toFixed(activeChain.decimals > 8 ? 8 : activeChain.decimals)} {activeChain.symbol}
          </Text>
          <Text style={styles.balanceUsd}>≈ {fmtUsd(balance?.usdValue || 0)}</Text>

          {/* Address Row */}
          <TouchableOpacity onPress={handleCopy} style={styles.addressRow}>
            <Text style={[styles.addressText, copied && styles.addressCopied]}>
              {copied ? '✓ copied to clipboard' : shortAddr(address)}
            </Text>
            <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <Rect x="9" y="9" width="13" height="13" rx="1" stroke={Colors.textDim} strokeWidth="1.5" strokeLinecap="square"/>
              <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke={Colors.textDim} strokeWidth="1.5" strokeLinecap="square"/>
            </Svg>
          </TouchableOpacity>
        </TerminalCard>

        {/* Quick Actions */}
        <View style={styles.actionsGrid}>
          <VaultButton variant="primary" small onPress={() => handleNavigate('send-multichain')}>
            <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <Line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
              <Polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
            </Svg>
            <Text>SEND</Text>
          </VaultButton>
          <VaultButton variant="outline" small onPress={() => handleNavigate('receive-multichain')}>
            <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
              <Polyline points="8 17 12 21 16 17"/>
              <Line x1="12" y1="12" x2="12" y2="21"/>
              <Path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/>
            </Svg>
            <Text>RECEIVE</Text>
          </VaultButton>
        </View>

        {/* Recent Activity */}
        {txs.length > 0 && (
          <View>
            <Text style={styles.sectionLabel}>RECENT ACTIVITY - {activeChain.symbol}</Text>
            <View style={styles.txList}>
              {txs.slice(0, 5).map((tx, i) => (
                <TerminalCard key={i} style={styles.txCard}>
                  <View style={styles.txRow}>
                    <View style={styles.txLeft}>
                      <View style={[
                        styles.txIcon,
                        tx.type === 'receive' ? styles.txIconReceive : styles.txIconSend
                      ]}>
                        {tx.type === 'send' ? (
                          <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <Line x1="22" y1="2" x2="11" y2="13" stroke={Colors.redDanger} strokeWidth="2" strokeLinecap="square"/>
                            <Polygon points="22 2 15 22 11 13 2 9 22 2" stroke={Colors.redDanger} strokeWidth="2" strokeLinecap="square"/>
                          </Svg>
                        ) : (
                          <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <Polyline points="8 17 12 21 16 17" stroke={Colors.greenPrimary} strokeWidth="2" strokeLinecap="square"/>
                            <Line x1="12" y1="12" x2="12" y2="21" stroke={Colors.greenPrimary} strokeWidth="2" strokeLinecap="square"/>
                          </Svg>
                        )}
                      </View>
                      <View>
                        <Text style={[
                          styles.txAmount,
                          tx.type === 'receive' && styles.txAmountReceive
                        ]}>
                          {tx.amount} {tx.asset}
                        </Text>
                        <Text style={styles.txTo}>
                          {tx.type === 'send' ? 'to ' : 'from '}{tx.to}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.txRight}>
                      <Text style={styles.txUsd}>{tx.usd}</Text>
                      <Text style={styles.txTime}>{tx.time}</Text>
                    </View>
                  </View>
                </TerminalCard>
              ))}
            </View>
          </View>
        )}

        {/* All Chains Overview */}
        <View>
          <Text style={styles.sectionLabel}>ALL NETWORKS</Text>
          <View style={styles.chainGrid}>
            {balances.map((bal, i) => {
              const chain = CHAINS[bal.chainId.toUpperCase()];
              if (!chain) return null;

              return (
                <TerminalCard key={bal.chainId} style={styles.chainOverviewCard}>
                  <View style={[styles.chainIconSmall, { backgroundColor: chain.color + '20', borderColor: chain.color }]}>
                    <Text style={[styles.chainIconSmallText, { color: chain.color }]}>{chain.icon}</Text>
                  </View>
                  <Text style={styles.chainOverviewName}>{chain.symbol}</Text>
                  <Text style={styles.chainOverviewBalance}>{bal.balance.toFixed(4)}</Text>
                  <Text style={styles.chainOverviewUsd}>${bal.usdValue.toFixed(2)}</Text>
                </TerminalCard>
              );
            })}
          </View>
        </View>
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
    paddingTop: 12,
    gap: 10,
  },
  portfolioCard: {
    alignItems: 'center',
    padding: 16,
  },
  portfolioLabel: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  portfolioValue: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '700',
    color: Colors.greenPrimary,
    marginTop: 6,
    textShadowColor: 'rgba(0,255,136,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  portfolioChains: {
    fontFamily: 'System',
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
  },
  balanceCard: {
    position: 'relative',
    overflow: 'hidden',
  },
  chainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  chainIconLarge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chainIconText: {
    fontSize: 20,
    fontWeight: '700',
  },
  chainHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chainHeaderName: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  balanceLabel: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  balanceAmount: {
    fontFamily: 'System',
    fontSize: 34,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: -0.7,
    lineHeight: 34,
  },
  balanceUsd: {
    fontFamily: 'System',
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  addressRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 6,
    paddingHorizontal: 8,
    backgroundColor: '#0a0f14',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  addressText: {
    flex: 1,
    fontFamily: 'System',
    fontSize: 10,
    color: Colors.cyanAccent,
  },
  addressCopied: {
    color: Colors.greenPrimary,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  sectionLabel: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  txList: {
    gap: 6,
  },
  txCard: {
    padding: 10,
    paddingHorizontal: 12,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  txIcon: {
    width: 30,
    height: 30,
    borderRadius: 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconReceive: {
    backgroundColor: '#001a0d',
    borderColor: Colors.greenFaint,
  },
  txIconSend: {
    backgroundColor: '#0a0006',
    borderColor: '#1a0010',
  },
  txAmount: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
  },
  txAmountReceive: {
    color: Colors.greenPrimary,
  },
  txTo: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    marginTop: 1,
  },
  txRight: {
    alignItems: 'flex-end',
  },
  txUsd: {
    fontFamily: 'System',
    fontSize: 11,
    color: Colors.textMuted,
  },
  txTime: {
    fontFamily: 'System',
    fontSize: 8,
    color: Colors.textDim,
    marginTop: 2,
  },
  chainGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chainOverviewCard: {
    width: '31%',
    padding: 10,
    alignItems: 'center',
  },
  chainIconSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  chainIconSmallText: {
    fontSize: 14,
    fontWeight: '700',
  },
  chainOverviewName: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  chainOverviewBalance: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  chainOverviewUsd: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    marginTop: 2,
  },
});
