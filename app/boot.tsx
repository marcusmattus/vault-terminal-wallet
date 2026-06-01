import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LogoMark, VaultButton, BlinkCursor, PromptLine } from '../components';
import { Colors } from '../constants/colors';

const BrandLockup: React.FC<{ accent: string; brandTop: string; brandBottom: string; tagline: string; big?: boolean }> = ({
  accent,
  brandTop,
  brandBottom,
  tagline,
  big = false
}) => (
  <View style={styles.brandLockup}>
    <View style={styles.brandLines}>
      <Text style={[
        styles.brandTop,
        {
          fontSize: big ? 26 : 22,
          color: accent,
          textShadowColor: `${accent}80`,
        }
      ]}>
        {brandTop}
      </Text>
      <Text style={[styles.brandBottom, { fontSize: big ? 26 : 22 }]}>
        {brandBottom}
      </Text>
    </View>
    <Text style={styles.tagline}>{tagline}</Text>
  </View>
);

const ClassicBoot: React.FC<{ accent: string; onComplete: () => void }> = ({ accent, onComplete }) => {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState<number[]>([]);
  const [showEnter, setShowEnter] = useState(false);

  const bootLines = [
    { text: 'vault-terminal v2.4.1 — secure boot', color: Colors.textMuted },
    { text: 'initializing encrypted keystore...', color: Colors.textMuted },
    { text: 'loading biometric layer...', color: Colors.textMuted },
    { text: 'checking device binding...', color: Colors.textMuted },
    { text: 'address risk engine: ONLINE', color: accent },
    { text: 'kyc provider: CONNECTED', color: accent },
    { text: 'establishing secure session...', color: Colors.textMuted },
    { text: 'vault ready.', color: accent, bold: true },
  ];

  useEffect(() => {
    const timers = bootLines.map((_, i) =>
      setTimeout(() => setVisible(v => [...v, i]), i * 500)
    );
    const enterT = setTimeout(() => setShowEnter(true), 4000);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(enterT);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoSection}>
        <View style={{ marginBottom: 28 }}>
          <LogoMark accent={accent} />
        </View>
        <BrandLockup
          accent={accent}
          brandTop="VAULT"
          brandBottom="TERMINAL"
          tagline="SECURE CRYPTO WALLET"
        />
      </View>
      <View style={styles.bootLog}>
        {bootLines.map((line, i) =>
          visible.includes(i) ? (
            <View key={i} style={styles.bootLine}>
              <Text style={[styles.bootPrompt, { color: accent }]}>&gt;</Text>
              <Text style={[
                styles.bootText,
                {
                  color: line.color,
                  fontWeight: line.bold ? '700' : '400',
                  textShadowColor: line.color === accent ? `${accent}66` : 'transparent',
                }
              ]}>
                {line.text}
                {i === bootLines.length - 1 && visible.length === bootLines.length && <BlinkCursor />}
              </Text>
            </View>
          ) : null
        )}
      </View>
      {showEnter && (
        <View style={[styles.enterSection, { paddingBottom: 32 + insets.bottom }]}>
          <VaultButton onPress={onComplete}>ENTER VAULT</VaultButton>
          <Text style={styles.biometricHint}>BIOMETRIC AUTH REQUIRED</Text>
        </View>
      )}
    </View>
  );
};

const MinimalBoot: React.FC<{ accent: string; onComplete: () => void }> = ({ accent, onComplete }) => {
  const insets = useSafeAreaInsets();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 2600;
    const interval = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / duration) * 100);
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 400);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const done = progress >= 100;

  return (
    <View style={[styles.minimalContainer, { paddingBottom: 32 + insets.bottom }]}>
      <View style={{ marginBottom: 30 }}>
        <LogoMark accent={accent} size={108} />
      </View>
      <BrandLockup
        accent={accent}
        brandTop="VAULT"
        brandBottom="TERMINAL"
        tagline="SECURE CRYPTO WALLET"
        big
      />
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill,
            {
              width: `${progress}%`,
              backgroundColor: accent,
              shadowColor: accent,
            }
          ]} />
        </View>
        <Text style={styles.progressText}>
          {done ? 'READY' : `LOADING ${Math.floor(progress)}%`}
        </Text>
      </View>
      {done && (
        <View style={styles.minimalButton}>
          <VaultButton onPress={onComplete} small>ENTER VAULT</VaultButton>
        </View>
      )}
    </View>
  );
};

export default function TerminalBoot() {
  const router = useRouter();
  const accent = Colors.greenPrimary;
  const [variant] = useState<'classic' | 'minimal'>('classic');

  const handleComplete = () => {
    router.replace('/unlock');
  };

  return (
    <View style={styles.fullScreen}>
      {variant === 'classic' ? (
        <ClassicBoot accent={accent} onComplete={handleComplete} />
      ) : (
        <MinimalBoot accent={accent} onComplete={handleComplete} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  logoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 44,
  },
  brandLockup: {
    alignItems: 'center',
    marginBottom: 8,
  },
  brandLines: {
    alignItems: 'center',
    marginBottom: 8,
  },
  brandTop: {
    fontFamily: 'System',
    fontWeight: '700',
    letterSpacing: 5.2,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    textTransform: 'uppercase',
  },
  brandBottom: {
    fontFamily: 'System',
    fontWeight: '400',
    letterSpacing: 5.2,
    color: Colors.white,
    textTransform: 'uppercase',
  },
  tagline: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  bootLog: {
    backgroundColor: Colors.bgSecondary,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    padding: 14,
    paddingHorizontal: 20,
    minHeight: 200,
  },
  bootLine: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  bootPrompt: {
    fontFamily: 'System',
    fontSize: 11,
    lineHeight: 19.8,
  },
  bootText: {
    fontFamily: 'System',
    fontSize: 11,
    lineHeight: 19.8,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  enterSection: {
    padding: 16,
    paddingHorizontal: 20,
    paddingBottom: 32,
    backgroundColor: Colors.bgSecondary,
  },
  biometricHint: {
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 1.5,
  },
  minimalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgPrimary,
    padding: 32,
  },
  progressSection: {
    width: 180,
    marginTop: 40,
  },
  progressBar: {
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: 2,
    height: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 12,
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 1.8,
  },
  minimalButton: {
    width: 200,
    marginTop: 28,
  },
});
