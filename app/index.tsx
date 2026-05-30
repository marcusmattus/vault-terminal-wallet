import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Line, Polygon, Polyline, Rect, Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { AppStatusBar, ScreenHeader, TerminalCard, VaultButton, BottomNav, KYCBadge } from '../components';
import { useAppStore, shortAddr, fmtUsd } from '../store/appStore';
import { Colors } from '../constants/colors';

export default function WalletDashboard() {
  const router = useRouter();
  const { balanceEth, ethPrice, address, txs, kyc } = useAppStore();
  const [copied, setCopied] = React.useState(false);

  const usdTotal = balanceEth * ethPrice;
  const displayAddress = shortAddr(address);

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
      <ScreenHeader title="Wallet Dashboard" subtitle="> session active — mainnet" />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Balance Card */}
        <TerminalCard glow style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
          <Text style={styles.balanceAmount}>{balanceEth.toFixed(5)}</Text>
          <Text style={styles.balanceUsd}>≈ {fmtUsd(usdTotal)} USD</Text>

          <View style={styles.networkRow}>
            <View style={styles.statusDot} />
            <Text style={styles.networkText}>ETHEREUM MAINNET</Text>
            <KYCBadge status={kyc} />
          </View>

          {/* Address Row */}
          <TouchableOpacity onPress={handleCopy} style={styles.addressRow}>
            <Text style={[styles.addressText, copied && styles.addressCopied]}>
              {copied ? '✓ copied to clipboard' : displayAddress}
            </Text>
            <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <Rect x="9" y="9" width="13" height="13" rx="1" stroke={Colors.textDim} strokeWidth="1.5" strokeLinecap="square"/>
              <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke={Colors.textDim} strokeWidth="1.5" strokeLinecap="square"/>
            </Svg>
          </TouchableOpacity>
        </TerminalCard>

        {/* Quick Actions */}
        <View style={styles.actionsGrid}>
          <VaultButton variant="primary" small onPress={() => handleNavigate('send')}>
            <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <Line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
              <Polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
            </Svg>
            <Text>SEND</Text>
          </VaultButton>
          <VaultButton variant="outline" small onPress={() => handleNavigate('receive')}>
            <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
              <Polyline points="8 17 12 21 16 17"/>
              <Line x1="12" y1="12" x2="12" y2="21"/>
              <Path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/>
            </Svg>
            <Text>RECEIVE</Text>
          </VaultButton>
        </View>

        {/* Recent Activity */}
        <View>
          <Text style={styles.sectionLabel}>RECENT ACTIVITY</Text>
          <View style={styles.txList}>
            {txs.map((tx, i) => (
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
  balanceCard: {
    position: 'relative',
    overflow: 'hidden',
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
  networkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.greenPrimary,
    shadowColor: 'rgba(0,255,136,0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  networkText: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.greenPrimary,
    letterSpacing: 1.2,
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
});
