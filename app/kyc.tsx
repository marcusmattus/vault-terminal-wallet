import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { AppStatusBar, ScreenHeader, TerminalCard, BottomNav, KYCBadge } from '../components';
import { Colors } from '../constants/colors';

export default function KYCStatus() {
  const router = useRouter();
  const [tab, setTab] = useState<'status' | 'log'>('status');

  const kycLevels = [
    { level: 'UNVERIFIED', desc: 'View-only / demo wallet', limit: '—', status: 'done' },
    { level: 'BASIC_VERIFIED', desc: 'Small deposits & transfers', limit: '0.5 ETH / tx', status: 'done' },
    { level: 'FULL_VERIFIED', desc: 'Full access + off-ramp', limit: '50 ETH / tx', status: 'current' },
    { level: 'RESTRICTED', desc: 'Blocked pending review', limit: '—', status: 'locked' },
  ];

  const logLines = [
    { text: 'kyc session initiated — provider: sumsub', time: '09:41', color: Colors.textMuted },
    { text: 'document submitted: PASSPORT', time: '09:42', color: Colors.textMuted },
    { text: 'liveness check: PASSED', time: '09:43', color: Colors.greenPrimary },
    { text: 'document verification: PASSED', time: '09:44', color: Colors.greenPrimary },
    { text: 'AML screening: CLEAR', time: '09:44', color: Colors.greenPrimary },
    { text: 'status upgraded: FULL_VERIFIED', time: '09:45', color: Colors.greenPrimary, bold: true },
  ];

  const handleNavigate = (screen: string) => {
    router.push(`/${screen === 'wallet' ? '' : screen}`);
  };

  return (
    <View style={styles.container}>
      <AppStatusBar />
      <ScreenHeader title="KYC STATUS" subtitle="> identity verified" />

      {/* Current Status Hero */}
      <View style={styles.heroSection}>
        <TerminalCard glow>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroLabel}>CURRENT STATUS</Text>
              <KYCBadge status="FULL_VERIFIED" />
            </View>
            <Svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={Colors.greenPrimary} strokeWidth="1.5" strokeLinecap="square" style={{ opacity: 0.6 }}>
              <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <Circle cx="12" cy="7" r="4"/>
              <Polyline points="16 11 18 13 22 9"/>
            </Svg>
          </View>

          <View style={styles.statsGrid}>
            <View>
              <Text style={styles.statLabel}>TX LIMIT</Text>
              <Text style={styles.statValueGreen}>50.0 ETH</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>PROVIDER</Text>
              <Text style={styles.statValue}>SUMSUB</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>VERIFIED</Text>
              <Text style={styles.statValueMuted}>2026-05-28</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>EXPIRES</Text>
              <Text style={styles.statValueMuted}>2027-05-28</Text>
            </View>
          </View>
        </TerminalCard>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['status', 'log'] as const).map(t => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[
              styles.tab,
              {
                borderBottomColor: tab === t ? Colors.greenPrimary : 'transparent',
              }
            ]}
          >
            <Text style={[
              styles.tabText,
              {
                color: tab === t ? Colors.greenPrimary : Colors.textDim,
                fontWeight: tab === t ? '700' : '400',
              }
            ]}>
              {t === 'status' ? 'TIER LEVELS' : 'SESSION LOG'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {tab === 'status' && kycLevels.map((item, i) => {
          const isCurrent = item.status === 'current';
          const isDone = item.status === 'done';
          return (
            <TerminalCard
              key={i}
              glow={isCurrent}
              style={[styles.levelCard, { opacity: item.status === 'locked' ? 0.4 : 1 }]}
            >
              <View style={styles.levelRow}>
                <View style={styles.levelLeft}>
                  <View style={[
                    styles.levelIcon,
                    {
                      backgroundColor: isDone || isCurrent ? Colors.greenFaint : Colors.bgSecondary,
                      borderColor: isDone || isCurrent ? Colors.greenPrimary : Colors.borderSubtle,
                    }
                  ]}>
                    {isDone && <Text style={styles.levelIconCheck}>✓</Text>}
                    {isCurrent && <View style={styles.levelIconDot} />}
                    {item.status === 'locked' && <Text style={styles.levelIconCross}>✕</Text>}
                  </View>
                  <View>
                    <Text style={[
                      styles.levelTitle,
                      {
                        color: isCurrent ? Colors.greenPrimary : isDone ? Colors.textMuted : Colors.textDim,
                      }
                    ]}>
                      {item.level}
                    </Text>
                    <Text style={styles.levelDesc}>{item.desc}</Text>
                  </View>
                </View>
                <Text style={[
                  styles.levelLimit,
                  { color: isCurrent ? Colors.greenPrimary : Colors.textDim }
                ]}>
                  {item.limit}
                </Text>
              </View>
            </TerminalCard>
          );
        })}

        {tab === 'log' && (
          <TerminalCard>
            <Text style={styles.logLabel}>KYC SESSION LOG</Text>
            {logLines.map((line, i) => (
              <View key={i} style={styles.logLine}>
                <Text style={styles.logTime}>{line.time}</Text>
                <Text style={styles.logPrompt}>&gt;</Text>
                <Text style={[
                  styles.logText,
                  {
                    color: line.color,
                    fontWeight: line.bold ? '700' : '400',
                    textShadowColor: line.color === Colors.greenPrimary ? 'rgba(0,255,136,0.3)' : 'transparent',
                  }
                ]}>
                  {line.text}
                </Text>
              </View>
            ))}
          </TerminalCard>
        )}
      </ScrollView>

      <BottomNav active="kyc" onNavigate={handleNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  heroSection: {
    padding: 16,
    paddingTop: 14,
    paddingBottom: 0,
    flexShrink: 0,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  heroLabel: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 1.8,
    marginBottom: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  statLabel: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  statValueGreen: {
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '700',
    color: Colors.greenPrimary,
  },
  statValue: {
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  statValueMuted: {
    fontFamily: 'System',
    fontSize: 11,
    color: Colors.textMuted,
  },
  tabs: {
    flexDirection: 'row',
    gap: 0,
    marginHorizontal: 16,
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
    flexShrink: 0,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    marginBottom: -1,
  },
  tabText: {
    fontFamily: 'System',
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 12,
    gap: 8,
  },
  levelCard: {
    padding: 10,
    paddingHorizontal: 12,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelIcon: {
    width: 20,
    height: 20,
    borderRadius: 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelIconCheck: {
    fontSize: 9,
    color: Colors.greenPrimary,
  },
  levelIconDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.greenPrimary,
    shadowColor: 'rgba(0,255,136,0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  levelIconCross: {
    fontSize: 9,
    color: Colors.textDim,
  },
  levelTitle: {
    fontFamily: 'System',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  levelDesc: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    marginTop: 1,
  },
  levelLimit: {
    fontFamily: 'System',
    fontSize: 10,
  },
  logLabel: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 1.8,
    marginBottom: 10,
  },
  logLine: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'baseline',
    marginBottom: 4,
  },
  logTime: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    flexShrink: 0,
  },
  logPrompt: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.greenPrimary,
    flexShrink: 0,
  },
  logText: {
    fontFamily: 'System',
    fontSize: 11,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
});
