import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export const BlinkCursor: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(v => !v);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[
      styles.cursor,
      {
        opacity: visible ? 1 : 0,
      }
    ]} />
  );
};

const styles = StyleSheet.create({
  cursor: {
    width: 8,
    height: 13,
    backgroundColor: Colors.greenPrimary,
    marginLeft: 2,
    shadowColor: 'rgba(0,255,136,0.8)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
});
