import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/colors';

interface VaultButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  onPress?: () => void;
  style?: ViewStyle;
  small?: boolean;
}

export const VaultButton: React.FC<VaultButtonProps> = ({
  children,
  variant = 'primary',
  onPress,
  style = {},
  small = false
}) => {
  const variants = {
    primary: {
      bg: Colors.greenPrimary,
      color: Colors.bgPrimary,
      borderColor: Colors.greenPrimary,
      shadowColor: 'rgba(0,255,136,0.4)'
    },
    outline: {
      bg: 'transparent',
      color: Colors.greenPrimary,
      borderColor: Colors.greenPrimary,
      shadowColor: 'rgba(0,255,136,0.2)'
    },
    ghost: {
      bg: 'transparent',
      color: Colors.textMuted,
      borderColor: Colors.borderSubtle,
      shadowColor: 'transparent'
    },
    danger: {
      bg: 'transparent',
      color: Colors.redDanger,
      borderColor: Colors.redDanger,
      shadowColor: 'rgba(255,77,77,0.2)'
    },
  };

  const v = variants[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: v.bg,
          borderColor: v.borderColor,
          shadowColor: v.shadowColor,
          padding: small ? 8 : 13,
          paddingHorizontal: small ? 16 : 20,
          shadowOffset: variant !== 'ghost' ? { width: 0, height: 0 } : undefined,
          shadowOpacity: variant !== 'ghost' ? 1 : 0,
          shadowRadius: variant !== 'ghost' ? 12 : 0,
        },
        style
      ]}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.text,
        {
          color: v.color,
          fontSize: small ? 10 : 12
        }
      ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 4,
    width: '100%',
  },
  text: {
    fontFamily: 'System',
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
