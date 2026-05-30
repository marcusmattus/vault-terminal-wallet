import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

type KYCStatus = 'FULL_VERIFIED' | 'BASIC_VERIFIED' | 'UNVERIFIED' | 'RESTRICTED' | 'SUSPENDED';

interface KYCBadgeProps {
  status: KYCStatus;
}

export const KYCBadge: React.FC<KYCBadgeProps> = ({ status }) => {
  const config = {
    FULL_VERIFIED: {
      color: Colors.greenPrimary,
      bg: '#001a0d',
      borderColor: Colors.greenPrimary,
      shadowColor: 'rgba(0,255,136,0.3)'
    },
    BASIC_VERIFIED: {
      color: Colors.yellowWarning,
      bg: '#1a1400',
      borderColor: Colors.yellowWarning,
      shadowColor: 'rgba(255,204,0,0.3)'
    },
    UNVERIFIED: {
      color: Colors.textMuted,
      bg: Colors.bgSecondary,
      borderColor: Colors.borderSubtle,
      shadowColor: 'transparent'
    },
    RESTRICTED: {
      color: Colors.yellowWarning,
      bg: '#1a1400',
      borderColor: Colors.yellowWarning,
      shadowColor: 'rgba(255,204,0,0.3)'
    },
    SUSPENDED: {
      color: Colors.redDanger,
      bg: '#1a0000',
      borderColor: Colors.redDanger,
      shadowColor: 'rgba(255,77,77,0.3)'
    },
  };

  const c = config[status] || config.UNVERIFIED;

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: c.bg,
        borderColor: c.borderColor,
        shadowColor: c.shadowColor,
      }
    ]}>
      <View style={[styles.dot, { backgroundColor: c.color }]} />
      <Text style={[styles.text, { color: c.color }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: 2,
    paddingVertical: 3,
    paddingHorizontal: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  text: {
    fontFamily: 'System',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
