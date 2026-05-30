import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../constants/colors';

interface LogoMarkProps {
  accent?: string;
  size?: number;
  glow?: boolean;
}

export const LogoMark: React.FC<LogoMarkProps> = ({
  accent = Colors.greenPrimary,
  size = 96,
  glow = true
}) => {
  return (
    <View style={[
      styles.container,
      {
        width: size,
        height: size,
        borderWidth: 1.5,
        borderColor: accent,
        borderRadius: size * 0.2,
        shadowColor: glow ? accent : 'transparent',
        backgroundColor: Colors.bgPrimary,
      }
    ]}>
      <View style={[
        styles.header,
        {
          height: size * 0.23,
          borderBottomWidth: 1,
          borderBottomColor: accent,
          paddingLeft: size * 0.083,
        }
      ]}>
        <Text style={[
          styles.promptText,
          {
            fontSize: size * 0.083,
            color: accent,
          }
        ]}>
          &gt;_
        </Text>
        <View style={[styles.dots, { paddingRight: size * 0.083 }]}>
          {[0, 1, 2].map(i => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  width: size * 0.052,
                  height: size * 0.052,
                  backgroundColor: accent,
                }
              ]}
            />
          ))}
        </View>
      </View>
      <View style={styles.iconContainer}>
        <Svg width={size * 0.54} height={size * 0.583} viewBox="0 0 52 56" fill="none">
          <Path
            d="M5,2 L47,2 L52,8 L33,8 L33,20 L28,20 L28,52 L33,52 L33,56 L19,56 L19,52 L24,52 L24,20 L19,20 L19,8 L0,8 Z"
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  promptText: {
    fontFamily: 'System',
    fontWeight: '700',
  },
  dots: {
    marginLeft: 'auto',
    flexDirection: 'row',
    gap: 3,
  },
  dot: {
    borderRadius: 999,
    opacity: 0.6,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
