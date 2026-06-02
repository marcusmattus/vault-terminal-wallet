import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Path, Polygon, Line, Polyline, Circle } from 'react-native-svg';
import { Colors } from '../constants/colors';

interface BottomNavProps {
  active: 'wallet' | 'send' | 'kyc' | 'security';
  onNavigate: (screen: string) => void;
}

const WalletIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="6" width="20" height="14" rx="1" stroke={color} strokeWidth="1.5" strokeLinecap="square"/>
    <Path d="M16 13h2M2 10h20" stroke={color} strokeWidth="1.5" strokeLinecap="square"/>
  </Svg>
);

const SendIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Line x1="22" y1="2" x2="11" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="square"/>
    <Polygon points="22 2 15 22 11 13 2 9 22 2" stroke={color} strokeWidth="1.5" strokeLinecap="square"/>
  </Svg>
);

const KYCIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="1.5" strokeLinecap="square"/>
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="1.5" strokeLinecap="square"/>
    <Polyline points="16 11 18 13 22 9" stroke={color} strokeWidth="1.5" strokeLinecap="square"/>
  </Svg>
);

const SecurityIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="1.5" strokeLinecap="square"/>
    <Polyline points="9 12 11 14 15 10" stroke={color} strokeWidth="1.5" strokeLinecap="square"/>
  </Svg>
);

export const BottomNav: React.FC<BottomNavProps> = ({ active, onNavigate }) => {
  const insets = useSafeAreaInsets();
  const tabs = [
    { id: 'wallet', label: 'WALLET', icon: WalletIcon },
    { id: 'send', label: 'SEND', icon: SendIcon },
    { id: 'kyc', label: 'KYC', icon: KYCIcon },
    { id: 'security', label: 'SECURITY', icon: SecurityIcon },
  ];

  return (
    <View style={[styles.container, { height: 64 + insets.bottom, paddingBottom: 8 + insets.bottom }]}>
      {tabs.map(tab => {
        const isActive = active === tab.id;
        const IconComponent = tab.icon;

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onNavigate(tab.id)}
            style={[styles.tab, { opacity: isActive ? 1 : 0.4 }]}
          >
            <IconComponent color={isActive ? Colors.greenPrimary : Colors.textMuted} />
            <Text style={[
              styles.label,
              {
                color: isActive ? Colors.greenPrimary : Colors.textMuted,
                fontWeight: isActive ? '700' : '400',
                textShadowColor: isActive ? 'rgba(0,255,136,0.5)' : 'transparent',
              }
            ]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // height & paddingBottom add the real home-indicator inset inline
    backgroundColor: Colors.bgSecondary,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexShrink: 0,
  },
  tab: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  label: {
    fontFamily: 'System',
    fontSize: 8,
    letterSpacing: 1.5,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.greenPrimary,
    marginTop: -2,
    shadowColor: 'rgba(0,255,136,0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
});
