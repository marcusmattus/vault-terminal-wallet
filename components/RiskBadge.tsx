import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface RiskBadgeProps {
  score: number;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ score }) => {
  const level = score < 30 ? 'LOW' : score < 70 ? 'MEDIUM' : 'HIGH';
  const color = score < 30 ? Colors.greenPrimary : score < 70 ? Colors.yellowWarning : Colors.redDanger;
  const shadowColor = score < 30 ? 'rgba(0,255,136,0.4)' : score < 70 ? 'rgba(255,204,0,0.4)' : 'rgba(255,77,77,0.4)';

  return (
    <View style={styles.container}>
      <Text style={[
        styles.level,
        {
          color,
          textShadowColor: shadowColor,
        }
      ]}>
        {level}{' '}
        <Text style={styles.score}>[{score}/100]</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  level: {
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  score: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '400',
  },
});
