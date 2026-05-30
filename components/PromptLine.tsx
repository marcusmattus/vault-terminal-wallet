import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface PromptLineProps {
  children: React.ReactNode;
  color?: string;
  dim?: boolean;
  indent?: boolean;
}

export const PromptLine: React.FC<PromptLineProps> = ({
  children,
  color = Colors.greenPrimary,
  dim = false,
  indent = false
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.prompt, { color: Colors.greenPrimary }]}>
        {indent ? '  ' : '>'}
      </Text>
      <Text style={[styles.text, { color: dim ? Colors.textDim : color }]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    lineHeight: 20.4,
  },
  prompt: {
    fontFamily: 'System',
    fontSize: 12,
    flexShrink: 0,
  },
  text: {
    fontFamily: 'System',
    fontSize: 12,
  },
});
