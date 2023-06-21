import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import {BlurView, type BlurViewProps} from '@react-native-community/blur';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  component: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

const StatusBarBlurBackground: React.FC<BlurViewProps> = props => {
  const safeAreaInsets = useSafeAreaInsets();
  if (Platform.OS !== 'ios') {
    return null;
  }
  return (
    <BlurView
      blurAmount={25}
      blurType="light"
      reducedTransparencyFallbackColor="rgba(140, 140, 140, 0.3)"
      style={[styles.component, {height: safeAreaInsets.top}, props.style]}
      {...props}
    />
  );
};

export default React.memo(StatusBarBlurBackground);
