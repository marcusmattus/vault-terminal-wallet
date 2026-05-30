import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Circle, Polyline, Line } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { AppStatusBar, LogoMark, VaultButton } from '../components';
import { useAppStore } from '../store/appStore';
import { Colors } from '../constants/colors';

export default function Unlock() {
  const router = useRouter();
  const { setUnlocked } = useAppStore();
  const [mode, setMode] = useState<'face' | 'pin'>('face');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [faceState, setFaceState] = useState<'idle' | 'scanning' | 'ok'>('idle');
  const accent = Colors.greenPrimary;
  const CORRECT_PIN = '424242';

  const runFace = () => {
    setFaceState('scanning');
    setTimeout(() => {
      setFaceState('ok');
      setTimeout(() => {
        setUnlocked(true);
        router.replace('/');
      }, 600);
    }, 1600);
  };

  const press = (k: string) => {
    if (faceState === 'scanning') return;
    setError(false);
    if (k === 'del') {
      setPin(p => p.slice(0, -1));
      return;
    }
    if (pin.length >= 6) return;
    const next = pin + k;
    setPin(next);
    if (next.length === 6) {
      setTimeout(() => {
        if (next === CORRECT_PIN) {
          setFaceState('ok');
          setTimeout(() => {
            setUnlocked(true);
            router.replace('/');
          }, 400);
        } else {
          setError(true);
          setPin('');
        }
      }, 200);
    }
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'bio', '0', 'del'];

  return (
    <View style={styles.container}>
      <AppStatusBar />

      {/* Brand + Face */}
      <View style={styles.topSection}>
        <LogoMark accent={accent} size={56} glow />
        <View style={styles.brand}>
          <Text style={[styles.brandText, { color: accent, textShadowColor: `${accent}66` }]}>
            VAULT TERMINAL
          </Text>
          <Text style={styles.lockedText}>VAULT LOCKED</Text>
        </View>

        {mode === 'face' && (
          <View style={styles.faceSection}>
            <TouchableOpacity
              onPress={runFace}
              style={[
                styles.faceButton,
                {
                  borderColor: faceState === 'ok' ? accent : Colors.borderSubtle,
                  shadowColor: faceState !== 'idle' ? accent : 'transparent',
                }
              ]}
            >
              <Svg width="100" height="100" viewBox="0 0 64 64" fill="none" stroke={faceState !== 'idle' ? accent : Colors.textDim} strokeWidth="1.5">
                <Path d="M16 24 v-4 a4 4 0 0 1 4 -4 h4" strokeLinecap="round"/>
                <Path d="M48 24 v-4 a4 4 0 0 0 -4 -4 h-4" strokeLinecap="round"/>
                <Path d="M16 40 v4 a4 4 0 0 0 4 4 h4" strokeLinecap="round"/>
                <Path d="M48 40 v4 a4 4 0 0 1 -4 4 h-4" strokeLinecap="round"/>
                <Circle cx="26" cy="30" r="1.6" fill={faceState !== 'idle' ? accent : Colors.textDim} stroke="none"/>
                <Circle cx="38" cy="30" r="1.6" fill={faceState !== 'idle' ? accent : Colors.textDim} stroke="none"/>
                <Path d="M32 30 v6" strokeLinecap="round"/>
                <Path d="M27 41 q5 3 10 0" strokeLinecap="round"/>
              </Svg>
              {faceState === 'ok' && (
                <View style={styles.checkOverlay}>
                  <Svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <Polyline points="20 6 9 17 4 12"/>
                  </Svg>
                </View>
              )}
            </TouchableOpacity>
            <Text style={[
              styles.faceStatus,
              { color: faceState === 'ok' ? accent : Colors.textMuted }
            ]}>
              {faceState === 'idle' ? 'TAP TO AUTHENTICATE' : faceState === 'scanning' ? 'SCANNING...' : '✓ UNLOCKED'}
            </Text>
            <TouchableOpacity onPress={() => setMode('pin')}>
              <Text style={styles.usePinLink}>USE PIN INSTEAD</Text>
            </TouchableOpacity>
          </View>
        )}

        {mode === 'pin' && (
          <View style={styles.pinSection}>
            <Text style={[styles.pinHint, { color: error ? Colors.redDanger : Colors.textDim }]}>
              {error ? 'INCORRECT PIN — TRY AGAIN' : 'ENTER 6-DIGIT PIN'}
            </Text>
            <View style={styles.pinDots}>
              {Array.from({ length: 6 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.pinDot,
                    {
                      backgroundColor: i < pin.length ? accent : 'transparent',
                      borderColor: i < pin.length ? accent : Colors.borderSubtle,
                      shadowColor: i < pin.length ? accent : 'transparent',
                    }
                  ]}
                />
              ))}
            </View>
            <Text style={styles.demoPin}>demo pin: 424242</Text>
          </View>
        )}
      </View>

      {/* Keypad */}
      {mode === 'pin' && (
        <View style={styles.keypad}>
          {keys.map((k, i) => {
            if (k === 'bio') {
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    setMode('face');
                    setPin('');
                    setError(false);
                  }}
                  style={styles.keyEmpty}
                >
                  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={Colors.textMuted} strokeWidth="1.5" strokeLinecap="round">
                    <Path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
                    <Circle cx="12" cy="12" r="2.5"/>
                  </Svg>
                </TouchableOpacity>
              );
            }
            if (k === 'del') {
              return (
                <TouchableOpacity key={i} onPress={() => press('del')} style={styles.keyEmpty}>
                  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={Colors.textMuted} strokeWidth="1.5" strokeLinecap="square">
                    <Path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
                    <Line x1="18" y1="9" x2="12" y2="15"/>
                    <Line x1="12" y1="9" x2="18" y2="15"/>
                  </Svg>
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity
                key={i}
                onPress={() => press(k)}
                style={styles.key}
              >
                <Text style={styles.keyText}>{k}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    paddingTop: 20,
  },
  brand: {
    alignItems: 'center',
  },
  brandText: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 4.4,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    textTransform: 'uppercase',
  },
  lockedText: {
    fontFamily: 'System',
    fontSize: 9,
    color: Colors.textDim,
    letterSpacing: 2,
    marginTop: 6,
  },
  faceSection: {
    alignItems: 'center',
    gap: 20,
    marginTop: 10,
  },
  faceButton: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5,5,5,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceStatus: {
    fontFamily: 'System',
    fontSize: 10,
    letterSpacing: 1.4,
  },
  usePinLink: {
    fontFamily: 'System',
    fontSize: 10,
    color: Colors.textDim,
    letterSpacing: 1.2,
    textDecorationLine: 'underline',
  },
  pinSection: {
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  pinHint: {
    fontFamily: 'System',
    fontSize: 9,
    letterSpacing: 1.6,
    height: 14,
  },
  pinDots: {
    flexDirection: 'row',
    gap: 12,
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  demoPin: {
    fontFamily: 'System',
    fontSize: 8,
    color: '#2a3340',
    letterSpacing: 1,
    marginTop: 2,
  },
  keypad: {
    width: '100%',
    paddingHorizontal: 36,
    paddingBottom: 28,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  key: {
    width: '30%',
    height: 58,
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '500',
    color: Colors.white,
  },
  keyEmpty: {
    width: '30%',
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
