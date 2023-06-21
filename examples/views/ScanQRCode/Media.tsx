import React from 'react';
import {StyleSheet, View} from 'react-native';
// import type {MediaProps} from '../../routes/ScanQRCode';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    rowGap: 16,
  },
});

// props: MediaProps
export default function Media() {
  return (
    <View style={styles.container}>
      {/* <Button
        onPress={() =>
          props.navigation.navigate('Media', {screen: 'Index'})
        }
        title="Products"
      /> */}
    </View>
  );
}
