import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import { Colors } from '../constants/colors';

interface StatusBarProps {
  time?: string;
}

// Content row is 30px tall; sits below the real device inset (notch / Dynamic Island).
// Falls back to 12px on devices that report a 0 top inset (older phones, web).
const STATUS_CONTENT = 30;

export const AppStatusBar: React.FC<StatusBarProps> = ({ time = "09:41" }) => {
  const insets = useSafeAreaInsets();
  const topPad = Math.max(insets.top, 12);
  return (
    <View style={[styles.container, { height: topPad + STATUS_CONTENT, paddingTop: topPad }]}>
      <Text style={styles.time}>{time}</Text>
      <View style={styles.icons}>
        {/* Signal strength */}
        <Svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <Rect x="0" y="4" width="3" height="7" rx="0.5" fill={Colors.textMuted}/>
          <Rect x="4" y="2.5" width="3" height="8.5" rx="0.5" fill={Colors.textMuted}/>
          <Rect x="8" y="1" width="3" height="10" rx="0.5" fill={Colors.textMuted}/>
          <Rect x="12" y="0" width="3" height="11" rx="0.5" fill={Colors.textDim}/>
        </Svg>
        {/* WiFi */}
        <Svg width="16" height="11" viewBox="0 0 16 11" fill="none">
          <Path d="M8 2C10.5 2 12.7 3 14.2 4.7L15.5 3.3C13.6 1.3 11 0 8 0C5 0 2.4 1.3 0.5 3.3L1.8 4.7C3.3 3 5.5 2 8 2Z" fill={Colors.textMuted}/>
          <Path d="M8 5C9.7 5 11.2 5.7 12.3 6.8L13.6 5.4C12.1 3.9 10.2 3 8 3C5.8 3 3.9 3.9 2.4 5.4L3.7 6.8C4.8 5.7 6.3 5 8 5Z" fill={Colors.textMuted}/>
          <Circle cx="8" cy="9.5" r="1.5" fill={Colors.textMuted}/>
        </Svg>
        {/* Battery */}
        <Svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <Rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke={Colors.textMuted} strokeOpacity="0.4"/>
          <Rect x="2" y="2" width="16" height="8" rx="1.5" fill={Colors.greenPrimary}/>
          <Rect x="22.5" y="3.5" width="2" height="5" rx="1" fill={Colors.textMuted} fillOpacity="0.4"/>
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // height & paddingTop are applied inline from the real safe-area inset
    paddingLeft: 24,
    paddingRight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    zIndex: 10,
  },
  time: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  icons: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
});
