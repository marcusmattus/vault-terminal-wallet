import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { AppStatusBar, ScreenHeader, TerminalCard, VaultButton, BottomNav } from '../components';
import { useAppStore } from '../store/appStore';
import { Colors } from '../constants/colors';

// QR Code generator (deterministic pattern based on seed)
const makeMatrix = (seed: string, n = 25): boolean[][] => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const rand = () => {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    return h / 0x7fffffff;
  };
  const m = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => rand() > 0.52)
  );

  // Add finder patterns (3 corners)
  const stamp = (r: number, c: number) => {
    for (let i = -1; i <= 7; i++) {
      for (let j = -1; j <= 7; j++) {
        const rr = r + i, cc = c + j;
        if (rr < 0 || cc < 0 || rr >= n || cc >= n) continue;
        const edge = i === 0 || i === 6 || j === 0 || j === 6;
        const core = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        const border = i === -1 || i === 7 || j === -1 || j === 7;
        m[rr][cc] = border ? false : (edge || core);
      }
    }
  };
  stamp(0, 0);
  stamp(0, n - 7);
  stamp(n - 7, 0);
  return m;
};

const QRCode: React.FC<{ value: string; accent: string; size?: number }> = ({
  value,
  accent,
  size = 196
}) => {
  const n = 25;
  const matrix = useMemo(() => makeMatrix(value, n), [value]);
  const cell = size / n;

  return (
    <View style={[styles.qrContainer, { width: size + 20, height: size + 20 }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {matrix.map((row, r) =>
          row.map((on, c) =>
            on ? (
              <Rect
                key={`${r}-${c}`}
                x={c * cell}
                y={r * cell}
                width={cell * 0.92}
                height={cell * 0.92}
                rx={cell * 0.18}
                fill={Colors.bgPrimary}
              />
            ) : null
          )
        )}
      </Svg>
      {/* Center logo chip */}
      <View style={[styles.qrLogo, { borderColor: accent }]}>
        <Svg width="18" height="20" viewBox="0 0 52 56" fill="none">
          <Path
            d="M5,2 L47,2 L52,8 L33,8 L33,20 L28,20 L28,52 L33,52 L33,56 L19,56 L19,52 L24,52 L24,20 L19,20 L19,8 L0,8 Z"
            fill="none"
            stroke={accent}
            strokeWidth="2.5"
          />
        </Svg>
      </View>
    </View>
  );
};

export default function Receive() {
  const router = useRouter();
  const { address } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [asset, setAsset] = useState('ETH');
  const accent = Colors.greenPrimary;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNavigate = (screen: string) => {
    router.push(`/${screen === 'wallet' ? '' : screen}`);
  };

  return (
    <View style={styles.container}>
      <AppStatusBar />
      <ScreenHeader
        title="Receive Crypto"
        subtitle="> inbound address"
        onBack={() => router.back()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Asset Selector */}
        <View style={styles.assetSelector}>
          {['ETH', 'USDC'].map(a => (
            <TouchableOpacity
              key={a}
              onPress={() => setAsset(a)}
              style={[
                styles.assetButton,
                {
                  backgroundColor: asset === a ? '#001a0d' : Colors.bgSecondary,
                  borderColor: asset === a ? accent : Colors.borderSubtle,
                  shadowColor: asset === a ? accent : 'transparent',
                }
              ]}
            >
              <Text style={[
                styles.assetButtonText,
                { color: asset === a ? accent : Colors.textMuted }
              ]}>
                {a}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* QR Code */}
        <View style={styles.qrSection}>
          <View style={[styles.qrFrame, { borderColor: accent, shadowColor: accent }]}>
            <QRCode value={address + asset} accent={accent} />
          </View>
          <Text style={styles.qrLabel}>
            SCAN TO SEND {asset} · ETHEREUM MAINNET
          </Text>
        </View>

        {/* Address Card */}
        <TerminalCard glow>
          <Text style={styles.addressLabel}>YOUR WALLET ADDRESS</Text>
          <Text style={styles.addressText}>{address}</Text>
          <View style={styles.buttonRow}>
            <VaultButton
              small
              variant={copied ? 'primary' : 'outline'}
              onPress={handleCopy}
              style={styles.halfButton}
            >
              {copied ? '✓ COPIED' : 'COPY ADDRESS'}
            </VaultButton>
            <VaultButton
              small
              variant="ghost"
              onPress={handleCopy}
              style={styles.halfButton}
            >
              <Svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                <Circle cx="18" cy="5" r="3"/>
                <Circle cx="6" cy="12" r="3"/>
                <Circle cx="18" cy="19" r="3"/>
                <Path d="M8.6 13.5L15.4 17.5"/>
                <Path d="M15.4 6.5L8.6 10.5"/>
              </Svg>
              <Text>SHARE</Text>
            </VaultButton>
          </View>
        </TerminalCard>

        {/* Warning */}
        <TerminalCard warn style={styles.warningCard}>
          <View style={styles.warningContent}>
            <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={Colors.yellowWarning} strokeWidth="1.5" strokeLinecap="square" style={styles.warningIcon}>
              <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <Path d="M12 9v4"/>
              <Path d="M12 17h.01"/>
            </Svg>
            <Text style={styles.warningText}>
              Send only <Text style={styles.warningHighlight}>{asset}</Text> and Ethereum-network assets to this address. Other networks may result in permanent loss.
            </Text>
          </View>
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
    gap: 14,
    alignItems: 'center',
  },
  assetSelector: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  assetButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 9,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  assetButtonText: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  qrSection: {
    alignItems: 'center',
    marginTop: 4,
  },
  qrFrame: {
    padding: 14,
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  qrContainer: {
    backgroundColor: Colors.white,
    borderRadius: 6,
    padding: 10,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrLogo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
    width: 40,
    height: 40,
    backgroundColor: Colors.bgPrimary,
    borderWidth: 1.5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  qrLabel: {
    marginTop: 14,
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 1.8,
  },
  addressLabel: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  addressText: {
    fontFamily: 'System',
    fontSize: 12,
    color: Colors.cyanAccent,
    lineHeight: 19.2,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  halfButton: {
    flex: 1,
  },
  warningCard: {
    padding: 10,
    paddingHorizontal: 12,
    width: '100%',
  },
  warningContent: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  warningIcon: {
    flexShrink: 0,
    marginTop: 1,
  },
  warningText: {
    fontFamily: 'System',
    fontSize: 10,
    color: Colors.textMuted,
    lineHeight: 16,
    flex: 1,
  },
  warningHighlight: {
    color: Colors.yellowWarning,
  },
});
