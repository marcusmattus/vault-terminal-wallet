import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { Colors } from '../constants/colors';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, subtitle, onBack }) => {
  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <Polyline points="15 18 9 12 15 6" stroke={Colors.textMuted} strokeWidth="1.5" strokeLinecap="square"/>
          </Svg>
        </TouchableOpacity>
      )}
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.greenPrimary,
    textShadowColor: 'rgba(0,255,136,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: 'System',
    fontSize: 10,
    color: Colors.textDim,
    letterSpacing: 1,
    marginTop: 2,
  },
});
