import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Svg, { Rect, Path, Line, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { AppStatusBar, ScreenHeader, TerminalCard, VaultButton, BottomNav } from '../components';
import { useAppStore } from '../store/appStore';
import { Colors } from '../constants/colors';

const Toggle: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
  <TouchableOpacity
    onPress={onToggle}
    style={[
      styles.toggle,
      {
        backgroundColor: enabled ? Colors.greenFaint : Colors.bgSecondary,
        borderColor: enabled ? Colors.greenPrimary : Colors.borderSubtle,
        shadowColor: enabled ? 'rgba(0,255,136,0.3)' : 'transparent',
      }
    ]}
  >
    <View style={[
      styles.toggleKnob,
      {
        left: enabled ? 20 : 3,
        backgroundColor: enabled ? Colors.greenPrimary : Colors.textDim,
        shadowColor: enabled ? 'rgba(0,255,136,0.6)' : 'transparent',
      }
    ]} />
  </TouchableOpacity>
);

const SecurityRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  sub?: string;
  right?: React.ReactNode;
  danger?: boolean;
}> = ({ icon, label, sub, right, danger }) => (
  <View style={styles.securityRow}>
    <View style={[
      styles.securityIcon,
      {
        backgroundColor: danger ? '#1a0000' : '#0a0f14',
        borderColor: danger ? '#7A1F1F' : Colors.borderSubtle,
      }
    ]}>
      {icon}
    </View>
    <View style={styles.securityInfo}>
      <Text style={[
        styles.securityLabel,
        { color: danger ? Colors.redDanger : Colors.white }
      ]}>
        {label}
      </Text>
      {sub && <Text style={styles.securitySub}>{sub}</Text>}
    </View>
    {right}
  </View>
);

export default function SecurityCentre() {
  const router = useRouter();
  const { biometricEnabled, pinEnabled, alertsEnabled, trustedDevices, toggleBiometric, togglePin, toggleAlerts } = useAppStore();

  const limits = [
    { label: 'DAILY LIMIT', value: '10.0 ETH', sub: 'resets 00:00 UTC', color: Colors.greenPrimary },
    { label: 'PER TX LIMIT', value: '5.0 ETH', sub: 'kyc: FULL_VERIFIED', color: Colors.greenPrimary },
    { label: 'USED TODAY', value: '1.5 ETH', sub: '15% of daily limit', color: Colors.yellowWarning },
  ];

  const handleNavigate = (screen: string) => {
    router.push(`/${screen === 'wallet' ? '' : screen}`);
  };

  return (
    <View style={styles.container}>
      <AppStatusBar />
      <ScreenHeader title="Security Centre" subtitle="> all systems nominal" />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Authentication */}
        <View>
          <Text style={styles.sectionLabel}>AUTHENTICATION</Text>
          <TerminalCard>
            <SecurityRow
              icon={
                <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <Path d="M12 10a2 2 0 0 1 2 2v2a2 2 0 0 1-4 0v-2a2 2 0 0 1 2-2z" stroke={Colors.greenPrimary} strokeWidth="1.5" strokeLinecap="square"/>
                  <Path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke={Colors.greenPrimary} strokeWidth="1.5" strokeLinecap="square"/>
                </Svg>
              }
              label="Face ID / Biometrics"
              sub="last used: just now"
              right={<Toggle enabled={biometricEnabled} onToggle={toggleBiometric} />}
            />
            <SecurityRow
              icon={
                <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <Rect x="3" y="11" width="18" height="11" rx="1" stroke={Colors.greenPrimary} strokeWidth="1.5" strokeLinecap="square"/>
                  <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={Colors.greenPrimary} strokeWidth="1.5" strokeLinecap="square"/>
                </Svg>
              }
              label="6-Digit PIN"
              sub="set 14 days ago"
              right={<Toggle enabled={pinEnabled} onToggle={togglePin} />}
            />
            <SecurityRow
              icon={
                <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <Path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke={Colors.cyanAccent} strokeWidth="1.5" strokeLinecap="square"/>
                  <Path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" stroke={Colors.cyanAccent} strokeWidth="1.5" strokeLinecap="square"/>
                  <Line x1="6" y1="1" x2="6" y2="4" stroke={Colors.cyanAccent} strokeWidth="1.5" strokeLinecap="square"/>
                  <Line x1="10" y1="1" x2="10" y2="4" stroke={Colors.cyanAccent} strokeWidth="1.5" strokeLinecap="square"/>
                  <Line x1="14" y1="1" x2="14" y2="4" stroke={Colors.cyanAccent} strokeWidth="1.5" strokeLinecap="square"/>
                </Svg>
              }
              label="Suspicious Activity Alerts"
              sub="email + push"
              right={<Toggle enabled={alertsEnabled} onToggle={toggleAlerts} />}
            />
          </TerminalCard>
        </View>

        {/* Spending Limits */}
        <View>
          <Text style={styles.sectionLabel}>SPENDING LIMITS</Text>
          <View style={styles.limitsGrid}>
            {limits.map((l, i) => (
              <TerminalCard key={i} style={styles.limitCard}>
                <Text style={styles.limitLabel}>{l.label}</Text>
                <Text style={[
                  styles.limitValue,
                  {
                    color: l.color,
                    textShadowColor: `${l.color}66`,
                  }
                ]}>
                  {l.value}
                </Text>
                <Text style={styles.limitSub}>{l.sub}</Text>
              </TerminalCard>
            ))}
          </View>
        </View>

        {/* Trusted Devices */}
        <View>
          <Text style={styles.sectionLabel}>TRUSTED DEVICES</Text>
          <TerminalCard>
            {trustedDevices.map((d, i) => (
              <SecurityRow
                key={i}
                danger={!d.trusted}
                icon={
                  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <Rect x="5" y="2" width="14" height="20" rx="2" ry="2" stroke={d.trusted ? Colors.greenPrimary : Colors.redDanger} strokeWidth="1.5" strokeLinecap="square"/>
                    <Line x1="12" y1="18" x2="12.01" y2="18" stroke={d.trusted ? Colors.greenPrimary : Colors.redDanger} strokeWidth="2.5" strokeLinecap="square"/>
                  </Svg>
                }
                label={d.name}
                sub={`${d.os} · ${d.lastSeen}`}
                right={
                  d.trusted ? (
                    <View style={styles.trustedBadge}>
                      <Text style={styles.trustedText}>TRUSTED</Text>
                    </View>
                  ) : (
                    <VaultButton variant="danger" small style={styles.revokeButton}>
                      REVOKE
                    </VaultButton>
                  )
                }
              />
            ))}
          </TerminalCard>
        </View>

        {/* Recovery */}
        <VaultButton variant="ghost">
          <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
            <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </Svg>
          <Text>VIEW RECOVERY PHRASE</Text>
        </VaultButton>
      </ScrollView>

      <BottomNav active="security" onNavigate={handleNavigate} />
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
    gap: 14,
  },
  sectionLabel: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#0F1823',
  },
  securityIcon: {
    width: 32,
    height: 32,
    borderRadius: 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  securityInfo: {
    flex: 1,
  },
  securityLabel: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  securitySub: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    marginTop: 2,
  },
  toggle: {
    width: 40,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    position: 'relative',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  toggleKnob: {
    position: 'absolute',
    top: 3,
    width: 14,
    height: 14,
    borderRadius: 7,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  limitsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  limitCard: {
    flex: 1,
    padding: 10,
  },
  limitLabel: {
    fontFamily: 'System',
    fontSize: 8,
    color: Colors.textDim,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  limitValue: {
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  limitSub: {
    fontFamily: 'System',
    fontSize: 8,
    color: Colors.textDim,
    marginTop: 3,
  },
  trustedBadge: {
    borderWidth: 1,
    borderColor: Colors.greenFaint,
    borderRadius: 2,
    paddingVertical: 2,
    paddingHorizontal: 6,
    backgroundColor: '#001a0d',
  },
  trustedText: {
    fontFamily: 'System',
    fontSize: 8,
    color: Colors.greenPrimary,
  },
  revokeButton: {
    width: 'auto',
    paddingVertical: 4,
    paddingHorizontal: 10,
    fontSize: 9,
  },
});
