import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/colors';

interface TerminalCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glow?: boolean;
  warn?: boolean;
  danger?: boolean;
}

export const TerminalCard: React.FC<TerminalCardProps> = ({
  children,
  style = {},
  glow = false,
  warn = false,
  danger = false
}) => {
  let borderColor = Colors.borderSubtle;
  let shadowColor = 'transparent';

  if (glow) {
    borderColor = Colors.greenPrimary;
    shadowColor = 'rgba(0,255,136,0.2)';
  } else if (warn) {
    borderColor = Colors.yellowWarning;
    shadowColor = 'rgba(255,204,0,0.2)';
  } else if (danger) {
    borderColor = Colors.redDanger;
    shadowColor = 'rgba(255,77,77,0.2)';
  }

  return (
    <View style={[
      styles.card,
      {
        borderColor,
        shadowColor,
        shadowOffset: glow || warn || danger ? { width: 0, height: 0 } : undefined,
        shadowOpacity: glow || warn || danger ? 1 : 0,
        shadowRadius: glow || warn || danger ? 10 : 0,
      },
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgSecondary,
    borderWidth: 1,
    borderRadius: 4,
    padding: 14,
    paddingHorizontal: 16,
  },
});
